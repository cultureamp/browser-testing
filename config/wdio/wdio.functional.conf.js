const selenium = require('selenium-standalone');
const config = require('./wdio.default.conf');

const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

let seleniumProcess;

const functionalConfig = { ...config.defaultConfig, specs: ['./tests/functional/**/*.test.js'] };

const localConfig = {
  maxInstances: 20,
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
  maxInstances: 10 };

exports.config = process.env.DOCKER ?
  { ...functionalConfig, ...dockerConfig } :
  { ...functionalConfig, ...localConfig };
