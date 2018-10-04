const fs = require('fs');
const path = require('path');
const browserJavaScripts = require('./browserJavaScripts');
const { saveImage } = require('./apiRequests/visualDroidApi');
const { delay } = require('./helper');
const VISUAL_SCREENSHOT_LOC = 'screenshots/visualTests';
const FAILURE_SCREENSHOT_LOC = 'screenshots/failures';
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

const failureScreenShotName = screenshotName => {
  return path.join(FAILURE_SCREENSHOT_LOC, `${screenshotName}.png`);
};

const visualScreenShotName = screenshotName => {
  return path.join(VISUAL_SCREENSHOT_LOC, `${screenshotName}.png`);
};

const saveScreenShot = (screenShotLoc, base64Image) => {
  fs.writeFileSync(screenShotLoc, Buffer.from(base64Image, 'base64'));
};

const getImageKey = metadata =>
  Object.keys(metadata)
    .map(k => metadata[k])
    .join(' ')
    .replace(/ /g, '_')
    .toLowerCase();

const takeScreenShot = async (imageKey, retries = 0) => {
  const MAX_RETRIES = 4;
  if (retries === MAX_RETRIES) {
    throw new Error(`Tried ${MAX_RETRIES} times. But the images did not match`);
  }
  /*
    The need to repaint the screen is primarily because of fonts. Sometimes on Edge the browser
    falls back on a lower priority font, because the higher priority font has not been loaded.
    This repaint ensures that the page is displayed with the correct font always.
  */
  await repaintScreen();
  /*
    We sometimes have screens which haven't finished loaded. This could be because of async calls.
    To make sure that when we take a screen shot it is in a stable state, we make sure that we take
    at least three screen shots. If three screen shots taken in succession are the same, it means the
    page is in its final state of loading.
  */
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
  saveScreenShot(visualScreenShotName(`${imageKey}_1`), screenShot01.value);
  saveScreenShot(visualScreenShotName(`${imageKey}_2`), screenShot02.value);
  saveScreenShot(visualScreenShotName(`${imageKey}_3`), screenShot03.value);
  return takeScreenShot(imageKey, retries + 1);
};

const setBrowserResolution = (w, h) => {
  const expectedWidth = parseInt(w, 10);
  const expectedHeight = parseInt(h, 10);
  /* 
    Sometimes when we set screen size, the browser driver fails to do so. 
    The check for browser size will let us know if it happens. If it does 
    happen we can try to set it recursively.
  */
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

const visualTest = (imageKey, metadata) => {
  return setBrowserResolution(metadata.width, metadata.height)
    .then(() => takeScreenShot(imageKey))
    .then(screenshot => saveImage(screenshot.value, imageKey, metadata));
};

module.exports = {
  CURRENT_BROWSER,
  SUPPORTED_BROWSERS,
  visualTest,
  imagesLoaded,
  runInBrowserstack,
  getMetaData,
  getImageKey,
  failureScreenShotName,
  saveScreenShot,
};
