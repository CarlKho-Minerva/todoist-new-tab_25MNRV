// Preload Todoist when browser starts
chrome.runtime.onStartup.addListener(() => {
  preloadTodoist();
});

// Preload on installation
chrome.runtime.onInstalled.addListener(() => {
  preloadTodoist();
});

function preloadTodoist() {
  // Check settings first
  chrome.storage.sync.get(['preload', 'darkMode'], (result) => {
    if (result.preload !== false) { // Default to true
      // Create a connection to Todoist to warm up the connection
      const url = result.darkMode ? 'https://todoist.com/app/today?theme=dark' : 'https://todoist.com/app/today';
      fetch(url, { mode: 'no-cors' }).catch(() => {
        // Silent fail is okay here, just trying to warm up connection
      });
    }
  });
}
