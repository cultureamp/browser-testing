const selenium = require('selenium-standalone');
const config = require('./wdio.default.conf');
const browserstack = require('browserstack-local');
const BROWSER_CONFIG = process.env.BROWSER_CONFIG ? process.env.BROWSER_CONFIG.toLocaleLowerCase() : null;
const BROWSERS = { FIREFOX: 'firefox', SAFARI: 'safari', IE10: 'ie10', IE11: 'ie11', EDGE: 'edge' };
const runTestsInDocker = Boolean(process.env.DOCKER);
const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

let seleniumProcess;
let browserStackConnection;
const capabilities = () => {
  switch (BROWSER_CONFIG) {
    case BROWSERS.FIREFOX:
      return [config.firefoxCapabilities];
    case BROWSERS.SAFARI:
      return [config.browserStackSafari];
    case BROWSERS.EDGE:
      return [config.browserStackEdge];
    case BROWSERS.IE10:
      return [config.browserStackIE10];
    case BROWSERS.IE11:
      return [config.browserStackIE11];
    default:
      return [config.chromeCapabilities];
  }
};

const visualConfig = {
  baseUrl: 'http://www.cultureamp.design',
  framework: 'mocha',
  waitforTimeout: 10000,
  logLevel: 'error',
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  specs: ['./tests/visual/**/*.test.js'],
  sync: false,
  capabilities: capabilities(),
  mochaOpts: {
    timeout: 20000,
    compilers: ['js:@babel/register']
  },
  before: () => {
    const chai = require('chai');
    global.expect = chai.expect;
  }
};

const localConfig = {
  maxInstances: 10,
  onPrepare: () => {
    return startSeleniumServer().then(process => {
      seleniumProcess = process;
    });
  },
  onComplete: () => {
    // eslint-disable-next-line no-console
    console.log('Shutting down Selenium');
    seleniumProcess.kill();
  }
};

const dockerConfig = {
  host: 'selenium-hub',
  port: 4444,
  path: '/wd/hub',
  maxInstances: 5
};

const browserStack = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  capabilities: capabilities(),
  // Code to start browserstack local before start of test

  onPrepare() {
    // eslint-disable-next-line no-console
    console.log('Connecting to BrowserStack');
    return new Promise(function(resolve, reject) {
      browserStackConnection = new browserstack.Local();
      // eslint-disable-next-line no-console
      console.log(browserStackConnection);
      // eslint-disable-next-line consistent-return
      browserStackConnection.start({ 'key': exports.config.key, force: true }, function(error) {
        if (error) {
          return reject(error);
        }
        // eslint-disable-next-line no-console
        console.log('Connected with BrowserStack.');
        resolve();
      });
    });
  },
  // Code to stop browserstack local after end of test
  onComplete() {
    return new Promise(function(resolve) {
      browserStackConnection.stop(function() {
        // eslint-disable-next-line no-console
        console.log('Stopped BrowserStack Connection');
        resolve();
      });
    });
  }
};

if (runTestsInDocker) {
  if (BROWSER_CONFIG && BROWSER_CONFIG !== BROWSERS.FIREFOX) {
    exports.config = Object.assign({}, visualConfig, browserStack);
  } else {
    exports.config = Object.assign({}, visualConfig, dockerConfig);
  }
} else if (BROWSER_CONFIG && BROWSER_CONFIG !== BROWSERS.FIREFOX) {
  exports.config = Object.assign({}, visualConfig, browserStack);
} else {
  exports.config = Object.assign({}, visualConfig, localConfig);
}
