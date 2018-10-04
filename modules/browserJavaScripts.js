// Keep the code of these scripts as ES5 version of javascript, as these run in the
// context of the browser and some new features are not supported in IE 10/11

const checkAllImageTagsLoaded = function() {
  function sleep(milliseconds) {
    var start = new Date().getTime();
    var i;
    for (i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  function imageComplete(image, retryAttempt) {
    if (retryAttempt === 10) {
      throw new Error('Unable to load image - ' + image.src);
    }
    if (image.complete) {
      return true;
    }
    sleep(1000);
    return imageComplete(image, retryAttempt + 1);
  }

  function imagesComplete() {
    var images = document.querySelectorAll('img');
    var i;
    for (i = 0; i < images.length; i++) {
      imageComplete(images[i], 1);
    }
    return true;
  }

  return imagesComplete();
};

const addBackgroundImagesAsNewImages = function() {
  function extractUrl(bgUrl) {
    // we are only concerned with images with an url and not any background image with gradients
    var url = bgUrl.match(/^url\\((['"]?)(.*)\\1\\)$/);
    return url ? url[2] : '';
  }

  function backgroundUrls() {
    var tags = document.getElementsByTagName('*');
    var allBackgroundURLs = [];
    var i;
    var bgUrl;
    for (i = 0; i < tags.length; i++) {
      bgUrl = window.getComputedStyle(tags[i]).backgroundImage;
      bgUrl = extractUrl(bgUrl);
      if (bgUrl !== '') {
        allBackgroundURLs.push(bgUrl);
      }
    }
    return allBackgroundURLs;
  }

  function addImages() {
    var urls = backgroundUrls();
    var i;
    var img;
    for (i = 0; i < urls.length; i++) {
      img = document.createElement('img');
      img.src = urls[i];
      document.body.appendChild(img);
    }
    return urls.length;
  }

  return addImages();
};

const repaintScreen = function() {
  var yAxis = window.pageYOffset;
  document.body.style.display = 'none';
  document.body.offsetHeight;
  document.body.style.display = '';
  window.scrollTo(0, yAxis);
};

const removeBackgroundImagesAddedAsNewImages = function(numberOfImages) {
  var images = document.querySelectorAll('img');
  var i;
  for (i = 1; i <= numberOfImages; i++) {
    document.body.removeChild(images[images.length - i]);
  }
};

module.exports = {
  addBackgroundImagesAsNewImages,
  repaintScreen,
  removeBackgroundImagesAddedAsNewImages,
  checkAllImageTagsLoaded,
};
