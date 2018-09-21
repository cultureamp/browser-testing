require('../../modules/hooksHelper');

describe('CultureAmp Design website style page 1', () => {
  it('shows the text Visuals', () => {
    return browser
      .url('/styles')
      .getText('[id=visuals]')
      .then(text => expect(text).to.equal('Visuals'));
  });
});
