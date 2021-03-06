const axios = require('axios');

const URL_VISUAL_DROID = process.env.URL_VISUAL_DROID;
const VISUAL_DROID_PASSWORD = process.env.VISUAL_DROID_PASSWORD;
const PROJECT_NAME = process.env.PROJECT_NAME;
const BRANCH_SHA = process.env.BRANCH_SHA;
const COMPARE_SHA = process.env.COMPARE_SHA;
const CI = process.env.CI;
const SAVE_IMAGE_URL = `${URL_VISUAL_DROID}/saveImage`;
const SAVE_AND_COMPARE_IMAGE_URL = `${URL_VISUAL_DROID}/saveAndCompareImage`;

const request = axios.create({
  baseURL: CI ? SAVE_IMAGE_URL : SAVE_AND_COMPARE_IMAGE_URL,
  auth: {
    password: VISUAL_DROID_PASSWORD,
  },
});

exports.saveImage = (imgBase64str, imageKey, metadata, compareOptions) => {
  const payload = {
    project: {
      name: PROJECT_NAME,
      branchSha: BRANCH_SHA,
      compareSha: COMPARE_SHA,
    },
    image: {
      key: imageKey,
      base64EncodeString: imgBase64str,
    },
    metadata,
  };

  if (typeof compareOptions !== 'undefined') {
    payload.image.looksSameAlgoOptions = compareOptions;
  }

  return request.post('/', payload).then(response => {
    const data = response.data;
    if (typeof data.errorMessage !== 'undefined') {
      throw new Error(`Visual comparison fail - ${data.errorMessage}`);
    }
    if (!CI) {
      // eslint-disable-next-line no-console
      console.info(data);
      return data.upload && data.imagesMatch;
    }
    return data.upload;
  });
};
