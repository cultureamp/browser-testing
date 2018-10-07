const { imagesLoaded } = require('modules/browserHelper');

export default class Page {
  constructor() {
    this.title = 'My Page';
  }

  open(path) {
    return browser
      .url(path)
      .then(
        () => expect(imagesLoaded(), 'All Images loaded').to.eventually.be.true
      );
  }
}
