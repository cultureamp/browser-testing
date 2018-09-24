const SCREEN_SIZE_DEFAULT = '2048x1536';
const SCREEN_SIZE_SAFARI = '1920x1080';
const { SUPPORTED_BROWSERS, CURRENT_BROWSER } = require('../../modules/browserHelper.js');
const PROJECT_NAME = process.env.PROJECT_NAME;

const chromeCapabilities = {
  browserName: 'chrome',
  os: 'Linux',
  os_version: 'Ubuntu',
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

const firefoxCapabilities = {
  browserName: 'firefox',
  os: 'Linux',
  os_version: 'Ubuntu',
  width: '1920',
  height: '1080',
  'moz:firefoxOptions': { args: ['-headless'] }
};

const browserStackConfig = (browserName, browserVersion, os, os_version, width = '1920', height = '1080') => {
  return {
    project: PROJECT_NAME,
    resolution: browserName.toLocaleLowerCase() === SUPPORTED_BROWSERS.SAFARI ? SCREEN_SIZE_SAFARI : SCREEN_SIZE_DEFAULT,
    browserName,
    browserVersion,
    os,
    os_version,
    width,
    height,
    'browserstack.local': true
  };
};

const browserStackIE10 = browserStackConfig('IE', '10', 'Windows', '7');
const browserStackIE11 = browserStackConfig('IE', '11', 'Windows', '10');
const browserStackEdge = browserStackConfig('Edge', '17', 'Windows', '10');
const browserStackSafari = browserStackConfig('Safari', '11', 'OS X', 'High Sierra');

const capabilities = () => {
  switch (CURRENT_BROWSER) {
    case SUPPORTED_BROWSERS.FIREFOX:
      return [firefoxCapabilities];
    case SUPPORTED_BROWSERS.SAFARI:
      return [browserStackSafari];
    case SUPPORTED_BROWSERS.EDGE:
      return [browserStackEdge];
    case SUPPORTED_BROWSERS.IE10:
      return [browserStackIE10];
    case SUPPORTED_BROWSERS.IE11:
      return [browserStackIE11];
    case null:
      return [chromeCapabilities];
    default:
      throw new Error(`${CURRENT_BROWSER} is an unsupported browser`);
  }
};

const defaultConfig = {
  baseUrl: 'http://www.cultureamp.design',
  waitforTimeout: 10000,
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  sync: false,
  capabilities: capabilities(),
  framework: 'mocha',
  mochaOpts: {
    timeout: 600000,
    compilers: ['js:@babel/register']
  },
  before: () => {
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    global.expect = chai.expect;
  }
};

module.exports = {
  defaultConfig
};
