const initialize = () => {
  addViewingAllText();
  processImages();
};

const addViewingAllText = () => {
  const buttons = document.querySelectorAll(
    '.btn.dropdown-toggle.selectpicker.btn-primary',
  );

  buttons.forEach((button) => {
    const newText = document.createTextNode('Viewing All');

    const newSpan = document.createElement('span');
    newSpan.classList.add('filter-option', 'pull-left');
    newSpan.appendChild(newText);

    button.parentNode.replaceChild(newSpan, button);
  });
};

const processImages = () => {
  const pppContainer = document.getElementById('ppp');
  if (!pppContainer) {
    return;
  }

  const imgElement = document.querySelector('.img-responsive.scan-page');

  if (!imgElement) {
    return;
  }

  let currentPage = 1;

  const srcUrl = imgElement.getAttribute('src');

  const aElement = imgElement.parentElement;
  aElement.removeAttribute('href');

  const loadNextImage = () => {
    currentPage++;

    const nextImageUrl = srcUrl.replace(
      /\d+(?=.jpg)/,
      currentPage.toString().padStart(2, '0'),
    );

    const img = new Image();
    img.src = nextImageUrl;

    img.onload = () => {
      const newImage = document.createElement('img');
      newImage.classList.add('img-responsive', 'scan-page');
      newImage.src = nextImageUrl;

      pppContainer.appendChild(newImage);

      loadNextImage();
    };

    img.onerror = () => {
      console.log('No more images available.');
    };
  };

  loadNextImage();
};

document.addEventListener('DOMContentLoaded', () => {
  const url = 'REPLACE_WITH_URL_OF_SITE';
  if (!window.location.href.startsWith(url)) {
    return;
  }

  chrome.storage.local.get(['isActive'], (result) => {
    const isActive = result.isActive;

    if (isActive) {
      initialize();
    }
  });
});
