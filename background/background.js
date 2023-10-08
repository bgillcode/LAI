const setExtensionIcon = (isActive) => {
  const iconPath = isActive
    ? {
        128: '../icons/lai_active.png',
      }
    : {
        128: '../icons/lai_inactive.png',
      };

  chrome.action.setIcon({ path: iconPath });
};

const initializeExtension = () => {
  chrome.storage.local.get(['isActive'], (result) => {
    const isActive = result.isActive;

    setExtensionIcon(isActive);

    if (result.isActive === undefined) {
      chrome.storage.local.set({ isActive: true }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            'Error setting storage value:',
            chrome.runtime.lastError,
          );
        }
      });
    }
  });
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    initializeExtension();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && 'isActive' in changes) {
    const isActive =
      changes.isActive.newValue === undefined
        ? true
        : changes.isActive.newValue;

    setExtensionIcon(isActive);
  }
});

initializeExtension();

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['isActive'], (result) => {
    const isActive = result.isActive;

    setExtensionIcon(isActive);
  });
});
