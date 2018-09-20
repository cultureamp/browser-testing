const PROJECT_NAME = 'browser-testing';
const SCREEN_SIZE_DEFAULT = '2048x1536';
const SCREEN_SIZE_SAFARI = '1920x1080';

exports.chromeCapabilities = {
  browserName: 'chrome',
  os: 'Linux',
  width: '1920',
  height: '1080',
  chromeOptions: {
    args: [
      '--no-sandbox',
      '--disable-web-security',
      '--headless',
      '--start-maximized'
    ]
  }
};

exports.firefoxCapabilities = {
  browserName: 'firefox',
  os: 'Linux',
  width: '1920',
  height: '1080',
  'moz:firefoxOptions': { args: ['-headless'] }
};

const browserStackConfig = (browserName, browserVersion, os, os_version, width = '1920', height = '1080') => {
  return {
    project: PROJECT_NAME,
    resolution: browserName === 'Safari' ? SCREEN_SIZE_SAFARI : SCREEN_SIZE_DEFAULT,
    browserName,
    browserVersion,
    os,
    os_version,
    width,
    height,
    'browserstack.local': true
  };
};

exports.browserStackIE10 = browserStackConfig('IE', '10', 'Windows', '7');
exports.browserStackIE11 = browserStackConfig('IE', '11', 'Windows', '10');
exports.browserStackEdge = browserStackConfig('Edge', '17', 'Windows', '10');
exports.browserStackSafari = browserStackConfig('Safari', '11', 'OS X', 'High Sierra');
