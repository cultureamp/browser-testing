const { saveImage } = require('./apiRequests/visualDroidApi');
const Promise = require('bluebird');

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

exports.runVisualTest = t => () => {
  const metadata = getMetaData(t.test.fullTitle());
  const imageKey = getImageKey(metadata);

  return setBrowserResolution(metadata.width, metadata.height)
    .then(() => takeScreenShot())
    .then(screenshot => saveImage(screenshot.value, imageKey, metadata))
    .then(success => expect(success).to.equal(true));
};
