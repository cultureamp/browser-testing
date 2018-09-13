const { runVisualTest } = require('../../modules/browserHelper');

describe('CultureAmp Design website style page 1', function() {
  it('shows the text Visuals', function() {
    return browser
      .url('/styles')
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'))
      .then(runVisualTest(this));
  });
});
