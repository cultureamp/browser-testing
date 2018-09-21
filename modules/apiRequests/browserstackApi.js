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

exports.getPlanInfo = () => {
  return request.get('plans.json')
    .then(response => {
      console.log(response.data);
    }).catch(e => {
      throw new Error(`Unable to get current open connections with browserstack, Error ${e}`);
    });
};
