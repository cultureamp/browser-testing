const { runVisualTest, runInBrowserstack } = require('./browserHelper');
const {
  connectionsAvailable,
  browserstackTestRunUrl,
} = require('./apiRequests/browserstackApi');

/* 
  Do not change to arrow function expressions as it does not have its own this, 
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
    if (this.currentTest.state === 'passed') {
      let errMsg = 'Visual Test Comparison';
      const visualTest = await runVisualTest(this.currentTest.fullTitle());
      if (runInBrowserstack) {
        const browserStackUrl = await browserstackTestRunUrl(browser.sessionId);
        errMsg = `${errMsg} BrowserstackUrl - ${browserStackUrl}`;
      }
      return expect(visualTest, errMsg).to.equal(true);
    }
    return true;
  });
};
