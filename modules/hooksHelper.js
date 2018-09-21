const { runVisualTest } = require('./browserHelper');
const { connectionsAvailable, browserstackTestRunUrl } = require('./apiRequests/browserstackApi');
const Promise = require('bluebird');

beforeEach(() => {
  return expect(connectionsAvailable(), 'Browserstack connections available').to.eventually.equal(true);
});

afterEach(function() {
  if (this.currentTest.state === 'passed') {
    return Promise.props({
      visualTest: runVisualTest(this.currentTest.fullTitle()),
      browserStackUrl: browserstackTestRunUrl(browser.sessionId)
    }).then(result => {
      // eslint-disable-next-line no-console
      console.log(`BrowserstackUrl - ${result.browserStackUrl}`);
      return expect(result.visualTest, 'Visual Test Comparison').to.equal(true);
    });
  }
  return true;
});
