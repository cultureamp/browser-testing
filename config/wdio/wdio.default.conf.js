// Required Settings
//   browserName: 'chrome',
//   os: 'Linux',
//   osVersion: 'ubuntu',
//   width: '1920',
//   height: '1080',
exports.chromeCapabilities = {
  browserName: 'chrome',
  os: 'Linux',
  osVersion: 'Ubuntu',
  width: '1920',
  height: '1080',
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
  os: 'Linux',
  osVersion: 'Ubuntu',
  width: '1920',
  height: '1080',
  'moz:firefoxOptions': { args: ['-headless'] }
};
