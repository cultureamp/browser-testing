const { saveImage } = require('./apiRequests/visualDroidApi');
const Promise = require('bluebird');
const CURRENT_BROWSER = process.env.BROWSER ? process.env.BROWSER.toLocaleLowerCase() : null;
const SUPPORTED_BROWSERS = { FIREFOX: 'firefox', SAFARI: 'safari', IE10: 'ie10', IE11: 'ie11', EDGE: 'edge' };

const executeScript = script => browser.execute(script).then(result => result.value);

const checkAllImageTagsLoaded = () => {
  const script = ` function sleep(milliseconds) {
                      var start = new Date().getTime();
                      for (var i = 0; i < 1e7; i++) {
                        if ((new Date().getTime() - start) > milliseconds) {
                          break;
                        }
                      }
                    }

                    function image_complete(image, retry_attempt) {
                      if (retry_attempt === 20) {
                        throw new Error('Unable to load image - ' + image.src)
                      }
                      if (image.complete) {
                        return true;
                      }
                      sleep(1000);
                      return image_complete(image, retry_attempt + 1);
                    }

                    function images_complete() {
                      var images = document.querySelectorAll('img');
                      for (var i = 0; i < images.length; i++) {
                        image_complete(images[i], 1);
                      }
                      return true;
                    }

                    return images_complete();
                  `;
  return executeScript(script);
};

const addBackgroundImagesAsNewImages = () => {
  const script = `function extractUrl(bgUrl) {
                    // we are only concerned with images with an url and not any background image with gradients
                    bgUrl = bgUrl.match(/^url\\((['"]?)(.*)\\1\\)$/);
                    return bgUrl ? bgUrl[2] : '';
                  };

                  function backgroundUrls() {
                    let tags = document.getElementsByTagName('*');
                    let allBackgroundURLs = [];
                    for (let i = 0; i < tags.length; i++) {
                      let bgUrl = window.getComputedStyle(tags[i]).backgroundImage;
                      bgUrl = extractUrl(bgUrl);
                      if (bgUrl !== '') {
                        allBackgroundURLs.push(bgUrl);
                      }
                    }
                    return allBackgroundURLs;
                  }

                  function add_images() {
                    let urls = backgroundUrls();
                    for (let i = 0; i < urls.length; i++) {
                      let img = document.createElement('img');
                      img.src = urls[i];
                      document.body.appendChild(img);
                    }
                    return urls.length;
                  }

                  return add_images();`;
  return executeScript(script);
};

const removeBackgroundImagesAddedAsNewImages = numberOfImages => {
  const script = ` var images = document.querySelectorAll('img');
                    for( var i = 1; i <= ${numberOfImages}; i++ ) {
                      document.body.removeChild(images[images.length - i]);
                    }
                 `;

  return executeScript(script);
};

const imagesLoaded = () => {
  if (CURRENT_BROWSER !== SUPPORTED_BROWSERS.SAFARI) {
    return checkAllImageTagsLoaded();
  }
  let loaded = false;

  return addBackgroundImagesAsNewImages()
    .then(numberOfNewImagesAdded => {
      return checkAllImageTagsLoaded()
        .then(allImagesLoaded => {
          loaded = allImagesLoaded;
          return removeBackgroundImagesAddedAsNewImages(numberOfNewImagesAdded);
        })
        .then(() => {
          return loaded;
        });
    });
};

const checkImagesLoaded = () => {
  return expect(imagesLoaded()).to.eventually.be.true;
};

const getBrowserConfig = () => {
  const browserCapabilities = browser.desiredCapabilities;
  const browserConfig = {
    // Maybe fail if these values are not provided
    os: browserCapabilities.os,
    osVersion: browserCapabilities.os_version,
    width: browserCapabilities.width,
    height: browserCapabilities.height
  };

  browserConfig.browserName = browserCapabilities.browserName;
  if (browserCapabilities.browserVersion) {
    browserConfig.browserVersion = browserCapabilities.browserVersion;
  }

  return browserConfig;
};

const getMetaData = testName => {
  const browserInfo = getBrowserConfig();
  return { imageName: testName.toLowerCase(), ...browserInfo };
};

const getImageKey = metadata =>
  Object.keys(metadata)
    .map(k => metadata[k])
    .join(' ')
    .replace(/ /g, '_')
    .toLowerCase();

const takeScreenShot = (retries = 0) => {
  const MAX_RETRIES = 4;
  if (retries === MAX_RETRIES) {
    // [TODO] Before throwing error save last three screenshots.
    throw new Error(`Took ${MAX_RETRIES}. But the images did not match`);
  }

  return Promise.props({
    screenShot01: browser.screenshot(),
    screenShot02: browser.screenshot(),
    screenShot03: browser.screenshot()
  }).then(screenShots => {
    if (screenShots.screenShot01.value === screenShots.screenShot02.value &&
      screenShots.screenShot02.value === screenShots.screenShot03.value) {
      return screenShots.screenShot01;
    }
    // eslint-disable-next-line no-console
    console.log('Images did not match, lets retry', retries + 1);
    return takeScreenShot(retries + 1);
  });
};

const setBrowserResolution = (w, h) => {
  const expectedWidth = parseInt(w, 10);
  const expectedHeight = parseInt(h, 10);

  return browser.setViewportSize({ width: expectedWidth, height: expectedHeight })
    .getViewportSize()
    .then(actualViewPortSize => {
      if (actualViewPortSize.width !== expectedWidth || actualViewPortSize.height !== expectedHeight) {
        throw new Error(`
            Unable to resize window. 
            Expected width,height - ${expectedWidth},${expectedHeight}
            Actual width,height - ${actualViewPortSize.width},${actualViewPortSize.height}`);
      }
    });
};

const runVisualTest = title => {
  const metadata = getMetaData(title);
  const imageKey = getImageKey(metadata);

  return setBrowserResolution(metadata.width, metadata.height)
    .then(() => takeScreenShot())
    .then(screenshot => saveImage(screenshot.value, imageKey, metadata));
};

module.exports = {
  CURRENT_BROWSER,
  SUPPORTED_BROWSERS,
  runVisualTest,
  checkImagesLoaded
};
