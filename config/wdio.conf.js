const selenium = require('selenium-standalone');
const axios = require('axios');
const browserstack = require('browserstack-local');
const { runInBrowserstack } = require('../modules/browserHelper');
const { delay } = require('../modules/helper');

let browserStackConnection;
let seleniumProcess;

// This is the screen size and not the size of the browser window
const SCREEN_SIZE_DEFAULT = '2048x1536';
const SCREEN_SIZE_SAFARI = '1920x1080';
const {
  SUPPORTED_BROWSERS,
  CURRENT_BROWSER,
} = require('../modules/browserHelper');
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
      '--start-maximized',
    ],
  },
};

const firefoxCapabilities = {
  browserName: 'firefox',
  os: 'Linux',
  os_version: 'Ubuntu',
  width: '1920',
  height: '1080',
  'moz:firefoxOptions': { args: ['-headless'] },
};

const browserStackConfig = (
  browserName,
  browserVersion,
  os,
  // eslint-disable-next-line camelcase
  os_version,
  width = '1920',
  height = '1080'
) => {
  return {
    project: PROJECT_NAME,
    resolution:
      browserName.toLocaleLowerCase() === SUPPORTED_BROWSERS.SAFARI
        ? SCREEN_SIZE_SAFARI
        : SCREEN_SIZE_DEFAULT,
    browserName,
    browserVersion,
    os,
    os_version,
    width,
    height,
    'browserstack.local': true,
  };
};

const browserStackIE10 = browserStackConfig('IE', '10', 'Windows', '7');
const browserStackIE11 = browserStackConfig('IE', '11', 'Windows', '10');
const browserStackEdge = browserStackConfig('Edge', '17', 'Windows', '10');
const browserStackSafari = browserStackConfig(
  'Safari',
  '11',
  'OS X',
  'High Sierra'
);

const capabilities = (() => {
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
    case SUPPORTED_BROWSERS.CHROME:
      return [chromeCapabilities];
    default:
      throw new Error(`${CURRENT_BROWSER} is an unsupported browser`);
  }
})();

const seleniumHubIsUp = async (attempt = 1) => {
  const MAX_ATTEMPT = 5;
  if (attempt === MAX_ATTEMPT) {
    throw new Error('Selenium hub is not running');
  }
  // eslint-disable-next-line no-console
  console.log(`Checking if Selenium hub is running. Attempt - ${attempt}`);
  try {
    await delay(1000)();
    let response = await axios.get('http://selenium-hub:4444/status');
    if (!response.data.value.ready) {
      return seleniumHubIsUp(attempt + 1);
    }
    // eslint-disable-next-line no-console
    console.log('Selenium hub is running');
  } catch (error) {
    throw new Error(`Selenium hub is not running. ${error}`);
  }
};

const maxInstances = 5;
const specs =
  process.env.TEST_TYPE === 'visual'
    ? ['./tests/visual/**/*.test.js']
    : ['./tests/functional/**/*.test.js'];

const defaultWdioConfig = {
  baseUrl: 'http://www.cultureamp.design',
  waitforTimeout: 100000,
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  sync: false,
  capabilities,
  framework: 'mocha',
  specs: specs,
  maxInstances,
  mochaOpts: {
    timeout: 600000,
    compilers: ['js:@babel/register'],
  },
  before: () => {
    const chai = require('chai');
    const chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    global.expect = chai.expect;
  },
};

const dockerWdioConfig = {
  host: 'selenium-hub',
  port: 4444,
  path: '/wd/hub',
  onPrepare: () => seleniumHubIsUp(),
};

const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

const localWdioConfig = {
  maxInstances: 10,
  onPrepare: () => {
    // eslint-disable-next-line no-console
    console.log('Starting Selenium');
    return startSeleniumServer().then(process => {
      seleniumProcess = process;
    });
  },
  onComplete: () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down Selenium');
    seleniumProcess.kill();
  },
};

const browserStackWdioConfig = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.debug': true,
  'browserstack.local': true,
  'browserstack.autoWait': 0,
  'browserstack.use_w3c': true,
  'browserstack.selenium_version': '3.7.1',
  'browserstack.ie.driver': '2.53.1',
  'ie.enablePersistentHover': true,
  'ie.enableFullPageScreenshot': false,
  maxInstances: 3,
  onPrepare() {
    // eslint-disable-next-line no-console
    console.log('Connecting to BrowserStack...');
    return new Promise((resolve, reject) => {
      browserStackConnection = new browserstack.Local();
      // eslint-disable-next-line consistent-return
      browserStackConnection.start({ force: true }, error => {
        if (error) {
          return reject(error);
        }
        // eslint-disable-next-line no-console
        console.log('Connected to BrowserStack.');
        resolve();
      });
    });
  },
  onComplete() {
    return new Promise(resolve => {
      browserStackConnection.stop(() => {
        // eslint-disable-next-line no-console
        console.log('Stopped BrowserStack Connection');
        resolve();
      });
    });
  },
};

if (runInBrowserstack) {
  exports.config = { ...defaultWdioConfig, ...browserStackWdioConfig };
} else if (process.env.DOCKER) {
  exports.config = { ...defaultWdioConfig, ...dockerWdioConfig };
} else {
  exports.config = { ...defaultWdioConfig, ...localWdioConfig };
}
