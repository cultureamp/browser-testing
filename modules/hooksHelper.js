const { runVisualTest } = require('./browserHelper');
const { connectionsAvailable, browserstackTestRunUrl } = require('./apiRequests/browserstackApi');
const Promise = require('bluebird');

beforeEach(() => expect(connectionsAvailable(), 'Browserstack connections available').to.eventually.equal(true));

afterEach(function() {
  if (this.currentTest.state === 'passed') {
    return Promise.props({
      visualTest: runVisualTest(this.currentTest.fullTitle()),
      browserStackUrl: browserstackTestRunUrl(browser.sessionId)
    }).then(result => expect(result.visualTest, `Visual Test Comparison. BrowserstackUrl - ${result.browserStackUrl}`).to.equal(true));
  }
  return true;
});
