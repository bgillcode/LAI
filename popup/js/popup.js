document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const extensionStateTextElement =
    document.getElementById('extensionStateText');

  chrome.storage.local.get(['isActive'], (result) => {
    toggleButton.innerText = result.isActive ? 'Disable' : 'Enable';
    extensionStateTextElement.innerText = result.isActive
      ? ' Enabled'
      : ' Disabled';
  });

  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get(['isActive'], (result) => {
      const isActive = result.isActive === undefined ? true : !result.isActive;

      chrome.storage.local.set({ isActive: isActive }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            'Error setting storage value:',
            chrome.runtime.lastError,
          );
          return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const currentTab = tabs[0];
          const tabUrl = currentTab.url;

          if (tabUrl.startsWith('http://') || tabUrl.startsWith('https://')) {
            chrome.tabs.reload(currentTab.id);
            window.close();
          } else {
            console.log('Page is not HTTP or HTTPS. Not reloading.');
            window.close();
          }
        });
      });
    });
  });
});
