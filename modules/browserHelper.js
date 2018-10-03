const browserJavaScripts = require('./browserJavaScripts');
const { saveImage } = require('./apiRequests/visualDroidApi');
const CURRENT_BROWSER = (process.env.BROWSER || 'chrome').toLocaleLowerCase();
const SUPPORTED_BROWSERS = {
  FIREFOX: 'firefox',
  SAFARI: 'safari',
  IE10: 'ie10',
  IE11: 'ie11',
  EDGE: 'edge',
  CHROME: 'chrome',
};

const runInBrowserstack =
  CURRENT_BROWSER !== SUPPORTED_BROWSERS.FIREFOX &&
  CURRENT_BROWSER !== SUPPORTED_BROWSERS.CHROME;

const executeScript = (script, params) =>
  browser.execute(script, params).then(result => result.value);

const repaintScreen = () => executeScript(browserJavaScripts.repaintScreen);

const checkAllImageTagsLoaded = () =>
  executeScript(browserJavaScripts.checkAllImageTagsLoaded);

const addBackgroundImagesAsNewImages = () =>
  executeScript(browserJavaScripts.addBackgroundImagesAsNewImages);

const removeBackgroundImagesAddedAsNewImages = numberOfImages =>
  executeScript(
    browserJavaScripts.removeBackgroundImagesAddedAsNewImages,
    numberOfImages
  );

const imagesLoaded = async () => {
  if (CURRENT_BROWSER !== SUPPORTED_BROWSERS.SAFARI) {
    return checkAllImageTagsLoaded();
  }
  const numberOfNewImagesAdded = await addBackgroundImagesAsNewImages();
  const imageTagsLoaded = await checkAllImageTagsLoaded();
  await removeBackgroundImagesAddedAsNewImages(numberOfNewImagesAdded);
  return imageTagsLoaded;
};

const getBrowserConfig = () => {
  const browserCapabilities = browser.desiredCapabilities;
  const browserConfig = {
    os: browserCapabilities.os,
    osVersion: browserCapabilities.os_version,
    width: browserCapabilities.width,
    height: browserCapabilities.height,
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

const delay = time => result =>
  new Promise(resolve => setTimeout(() => resolve(result), time));

const takeScreenShot = async (retries = 0) => {
  const MAX_RETRIES = 4;
  if (retries === MAX_RETRIES) {
    // DO THIS
    // [TODO] Before throwing error save last three screenshots.
    throw new Error(`Took ${MAX_RETRIES}. But the images did not match`);
  }
  // ADD COMMENTS AROUND THIS. add delay between screen shots
  await repaintScreen();
  const screenShot01 = await browser.screenshot().then(delay(100));
  const screenShot02 = await browser.screenshot().then(delay(100));
  const screenShot03 = await browser.screenshot().then(delay(100));

  if (
    screenShot01.value === screenShot02.value &&
    screenShot02.value === screenShot03.value
  ) {
    return screenShot01;
  }
  // eslint-disable-next-line no-console
  console.log('Images did not match, lets retry', retries + 1);
  return takeScreenShot(retries + 1);
};

const setBrowserResolution = (w, h) => {
  const expectedWidth = parseInt(w, 10);
  const expectedHeight = parseInt(h, 10);
  //  add comments for checking after setting size
  return browser
    .setViewportSize({ width: expectedWidth, height: expectedHeight })
    .getViewportSize()
    .then(actualViewPortSize => {
      if (
        actualViewPortSize.width !== expectedWidth ||
        actualViewPortSize.height !== expectedHeight
      ) {
        throw new Error(`
            Unable to resize window. 
            Expected width,height - ${expectedWidth},${expectedHeight}
            Actual width,height - ${actualViewPortSize.width},${
          actualViewPortSize.height
        }`);
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
  imagesLoaded,
  runInBrowserstack,
};
