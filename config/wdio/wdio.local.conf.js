// const Promise = require('es6-promise').Promise;
const selenium = require('selenium-standalone');
const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

let seleniumProcess;

exports.config = {
  baseUrl: 'http://www.cultureamp.design',
  framework: 'mocha',
  waitforTimeout: 60000,
  logLevel: 'error',
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  specs: ['./tests/*.test.js'],
  maxInstances: 20,
  capabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['no-sandbox', 'disable-web-security', '--headless']
      }
    },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['-headless']
      }
    }
  ],
  mochaOpts: {
    timeout: 40000,
    compilers: ['js:babel-core/register']
  },
  onPrepare: () => {
    return startSeleniumServer().then(process => {
      seleniumProcess = process;
    });
  },
  onComplete: () => {
    console.log('Shutting down Selenium');
    seleniumProcess.kill();
  },
  before: () => {
    const chai = require('chai');
    global.expect = chai.expect;
  }
};
