const axios = require('axios');
const USER = process.env.BROWSERSTACK_USERNAME;
const PASSWORD = process.env.BROWSERSTACK_ACCESS_KEY;

const request = axios.create({
  baseURL: 'https://api.browserstack.com/automate',
  auth: {
    username: USER,
    password: PASSWORD
  }
});

exports.connectionsAvailable = () => {
  return request.get('plan.json')
    .then(response => {
      // eslint-disable-next-line no-console
      console.log(response.data);
      return true;
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Unable to get browserstack plan - ${e}`);
      return false;
    });
};

exports.browserstackTestRunUrl = sessionId => {
  return request.get(`sessions/${sessionId}.json`)
    .then(response => response.data.automation_session.public_url)
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Unable to get sessionid - ${e}`);
      return false;
    });
};
