const config = require('./wdio.default.conf');

exports.config = {
  host: 'selenium-hub',
  port: 4444,
  path: '/wd/hub',
  baseUrl: 'http://www.cultureamp.design',
  framework: 'mocha',
  waitforTimeout: 60000,
  logLevel: 'error',
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  specs: ['./tests/*.test.js'],
  maxInstances: 10,
  capabilities: [config.chromeCapabilities, config.firefoxCapabilities],
  mochaOpts: {
    timeout: 40000,
    compilers: ['js:babel-core/register']
  },
  before: () => {
    const chai = require('chai');
    global.expect = chai.expect;
  }
};
