require('../../modules/hooksHelper');
const { checkImagesLoaded } = require('../../modules/browserHelper');

describe('CultureAmp Design website style page 0', () => {
  it('shows the text Visuals', () => {
    return browser
      .url('/styles')
      .then(() => checkImagesLoaded())
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'));
  });
});
