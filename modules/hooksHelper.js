const {
  visualTest,
  runInBrowserstack,
  getMetaData,
  getImageKey,
  saveScreenShot,
  failureScreenShotName,
} = require('./browserHelper');
const {
  connectionsAvailable,
  browserstackTestRunUrl,
} = require('./apiRequests/browserstackApi');

/* 
  Do not change to arrow function expressions as it does not have its own `this`, 
  which we need for getting the test name 
*/
exports.addHooks = function() {
  beforeEach(function() {
    if (runInBrowserstack) {
      expect(
        connectionsAvailable(),
        'Browserstack connections available'
      ).to.eventually.equal(true);
    }
  });
  afterEach(async function() {
    const metadata = getMetaData(this.currentTest.fullTitle());
    const imageKey = getImageKey(metadata);
    if (this.currentTest.state === 'passed') {
      let msg = 'Visual Test Comparison';
      const visualTestResult = await visualTest(imageKey, metadata);
      if (runInBrowserstack) {
        const browserStackUrl = await browserstackTestRunUrl(browser.sessionId);
        msg = `${msg} BrowserstackUrl - ${browserStackUrl}`;
      }
      return expect(visualTestResult, msg).to.equal(true);
    }
    const screenShot01 = await browser.screenshot();
    saveScreenShot(failureScreenShotName(`${imageKey}_1`), screenShot01.value);
  });
};
