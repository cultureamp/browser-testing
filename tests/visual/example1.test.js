const { addHooks } = require('../../modules/hooksHelper');
addHooks();
const { imagesLoaded } = require('../../modules/browserHelper');

describe('CultureAmp Design website style page 1', () => {
  it('shows the text Visuals', () => {
    return browser
      .url('/styles')
      .then(
        () => expect(imagesLoaded(), 'All Images loaded').to.eventually.be.true
      )
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'));
  });
});
