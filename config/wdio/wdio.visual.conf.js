const selenium = require('selenium-standalone');
const config = require('./wdio.default.conf');
const browserstack = require('browserstack-local');
const browserStackApi = require('../../modules/apiRequests/browserstackApi');
const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => (err ? reject(err) : resolve(process)));
  });
};

let seleniumProcess;
let browserStackConnection;

const visualConfig = { ...config.defaultConfig, specs: ['./tests/visual/**/*.test.js'] };

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

const browserStackConfig = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  // Code to start browserstack local before start of test
  onPrepare() {
    // eslint-disable-next-line no-console
    console.log('Connecting to BrowserStack...');
    return new Promise((resolve, reject) => {
      browserStackConnection = new browserstack.Local();
      // eslint-disable-next-line consistent-return
      browserStackConnection.start({ 'key': exports.config.key, force: true }, error => {
        if (error) {
          return reject(error);
        }
        // eslint-disable-next-line no-console
        console.log('Connected to BrowserStack.');
        resolve();
      });
    });
  },
  // Code to stop browserstack local after end of test
  onComplete() {
    return new Promise(resolve => {
      browserStackConnection.stop(() => {
        // eslint-disable-next-line no-console
        console.log('Stopped BrowserStack Connection');
        resolve();
      });
    });
  }
};

if (config.CURRENT_BROWSER && config.CURRENT_BROWSER !== config.SUPPORTED_BROWSERS.FIREFOX) {
  // run non chrome and firefox tests in browserstack
  exports.config = { ...visualConfig, ...browserStackConfig };
} else if (process.env.DOCKER) {
  exports.config = { ...visualConfig, ...dockerConfig };
} else {
  exports.config = { ...visualConfig, ...localConfig };
}
