import Page from './page';

class StylesPage extends Page {
  /**
   * define or overwrite page methods
   */
  open() {
    return super.open('styles');
  }

  getContentHeadingText() {
    return browser.getText('[id=visuals]');
  }
}

export default new StylesPage();
