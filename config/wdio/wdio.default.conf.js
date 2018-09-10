exports.chromeCapabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: [
      '--no-sandbox',
      '--disable-web-security',
      '--headless',
      '--start-maximized'
    ]
  }
};

exports.firefoxCapabilities = {
  browserName: 'firefox',
  'moz:firefoxOptions': { args: ['-headless'] }
};
