const axios = require('axios');
const USER = process.env.BROWSERSTACK_USERNAME;
const PASSWORD = process.env.BROWSERSTACK_ACCESS_KEY;

const request = axios.create({
  baseURL: 'https://api.browserstack.com/automate',
  auth: {
    username: USER,
    password: PASSWORD,
  },
});

const pause = duration => new Promise(res => setTimeout(res, duration));

const connectionsAvailable = (retries = 0) => {
  const MAX_RETRIES = 5;
  if (retries === MAX_RETRIES) {
    // eslint-disable-next-line no-console
    console.log(
      `Reached ${MAX_RETRIES} retries. Browserstack connections not available`
    );
    return false;
  }
  return request
    .get('plan.json')
    .then(response => {
      // Run at reduced capacity, as multiple sessions try to run the tests at the same time and that causes browserstack
      // to wrongly report how many sessions are running, as it does not update the sessions in realtime. This does not
      // slow down the tests as we have MAX_ACTIVE_SESSIONS < MAX_QUEUED_SESSIONS
      const CAPACITY = 0.7;
      const MAX_ACTIVE_SESSIONS = response.data.parallel_sessions_max_allowed;
      const MAX_QUEUED_SESSIONS = response.data.queued_sessions_max_allowed;
      const ACTIVE_SESSIONS = response.data.parallel_sessions_running;
      const QUEUED_SESSIONS = response.data.queued_sessions;
      const MAX_QUEUE = Math.ceil(
        (MAX_ACTIVE_SESSIONS + MAX_QUEUED_SESSIONS) * CAPACITY
      );
      const CURRENT_QUEUE = ACTIVE_SESSIONS + QUEUED_SESSIONS;
      // eslint-disable-next-line no-console
      console.log(
        `Max sessions allowed - ${MAX_QUEUE}, Current sessions running - ${CURRENT_QUEUE}`
      );
      return CURRENT_QUEUE < MAX_QUEUE
        ? true
        : pause(30000).then(() => connectionsAvailable(retries + 1));
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Unable to get browserstack plan - ${e}`);
      return false;
    });
};

const browserstackTestRunUrl = sessionId => {
  return request
    .get(`sessions/${sessionId}.json`)
    .then(response => response.data.automation_session.public_url)
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(`Unable to get sessionid - ${e}`);
      return false;
    });
};

module.exports = {
  connectionsAvailable,
  browserstackTestRunUrl,
};
