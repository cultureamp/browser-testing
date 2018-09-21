const axios = require('axios');

const URL_VISUAL_DROID = process.env.URL_VISUAL_DROID;
const VISUAL_DROID_PASSWORD = process.env.VISUAL_DROID_PASSWORD;
const PROJECT_NAME = process.env.PROJECT_NAME;
const BRANCH_SHA = process.env.BRANCH_SHA;
const COMPARE_SHA = process.env.COMPARE_SHA;
const BUILDKITE = process.env.BUILDKITE;
const SAVE_IMAGE_URL = `${URL_VISUAL_DROID}/saveImage`;
const SAVE_AND_COMPARE_IMAGE_URL = `${URL_VISUAL_DROID}/saveAndCompareImage`;

const request = axios.create({
  baseURL: BUILDKITE ? SAVE_IMAGE_URL : SAVE_AND_COMPARE_IMAGE_URL,
  auth: {
    password: VISUAL_DROID_PASSWORD
  }
});

exports.saveImage = (imgBase64str, imageKey, metadata, compareOptions) => {
  const payload = {
    project: {
      name: PROJECT_NAME,
      branchSha: BRANCH_SHA,
      compareSha: COMPARE_SHA
    },
    image: {
      key: imageKey,
      base64EncodeString: imgBase64str
    },
    metadata
  };

  if (typeof compareOptions !== 'undefined') {
    payload.image.looksSameAlgoOptions = compareOptions;
  }

  return request.post('/', payload)
    .then(response => {
      if (typeof response.data.errorMessage !== 'undefined') {
        throw new Error(`Visual comparison fail - ${response.data.errorMessage}`);
      }
      if (!BUILDKITE) {
        // Maybe setup so that we get debug info with a debug flag when not running in buildkite
        // eslint-disable-next-line no-console
        console.info(response.data);
      }
      return true;
    });
};
