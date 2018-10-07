const { addHooks } = require('../../modules/hooksHelper');
addHooks();
import StylesPage from 'pageobjects/styles.page';

describe('CultureAmp Design website style page 1', () => {
  it('shows the text Visuals', () => {
    return StylesPage.open()
      .then(() => StylesPage.getContentHeadingText())
      .then(text => expect(text).to.equal('Visuals'));
  });
});
