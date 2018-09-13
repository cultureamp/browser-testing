const selenium = require('selenium-standalone');
const config = require('./wdio.default.conf');

const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

let seleniumProcess;
const capabilities = process.env.BROWSER_CONFIG === 'Firefox' ? [config.firefoxCapabilities] : [config.chromeCapabilities];

const visualConfig = {
  baseUrl: 'http://www.cultureamp.design',
  framework: 'mocha',
  waitforTimeout: 10000,
  logLevel: 'error',
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  specs: ['./tests/visual/**/*.test.js'],
  sync: false,
  capabilities,
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

exports.config = process.env.DOCKER ?
  exports.config = Object.assign({}, visualConfig, dockerConfig) :
  Object.assign({}, visualConfig, localConfig);
