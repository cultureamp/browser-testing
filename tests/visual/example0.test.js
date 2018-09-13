const { saveImage } = require('../../modules/visualDroidApi');
const getBrowserConfig = () => {
  const browserCapabilities = browser.desiredCapabilities;
  const browserConfig = {
    browserName: browserCapabilities.browserName,
    os: browserCapabilities.os,
    osVersion: browserCapabilities.osVersion,
    width: browserCapabilities.width,
    height: browserCapabilities.height
  };
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

const runVisualTest = t => () => {
  const metadata = getMetaData(t.test.fullTitle());
  const imageKey = getImageKey(metadata);
  return browser.screenshot()
    .then(screenshot => saveImage(screenshot.value, imageKey, metadata))
    .then(success => expect(success).to.equal(true));
};

describe('CultureAmp Design website style page 0', function() {
  it('shows the text Visuals', function() {
    return browser
      .url('/styles')
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'))
      .then(runVisualTest(this));
  });
});
