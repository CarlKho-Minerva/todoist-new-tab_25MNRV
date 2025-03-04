document.addEventListener('DOMContentLoaded', () => {
  const implementationRadios = document.querySelectorAll('input[name="implementation"]');
  const apiTokenInput = document.getElementById('api-token');
  const tokenGroup = document.getElementById('token-group');
  const saveButton = document.getElementById('save');
  const saveMessage = document.getElementById('save-message');
  const darkModeCheckbox = document.getElementById('dark-mode');
  const preloadCheckbox = document.getElementById('preload');
  
  // Check if system prefers dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('system-dark');
  }
  
  // Load saved options
  chrome.storage.sync.get(
    ['implementation', 'apiToken', 'darkMode', 'preload'], 
    (result) => {
      const implementation = result.implementation || 'iframe';
      const apiToken = result.apiToken || '';
      const darkMode = result.darkMode || false;
      const preload = result.preload !== false; // Default to true
      
      // Set form values
      document.querySelector(`input[value="${implementation}"]`).checked = true;
      apiTokenInput.value = apiToken;
      darkModeCheckbox.checked = darkMode;
      preloadCheckbox.checked = preload;
      
      // Show/hide token input based on implementation
      if (implementation === 'iframe') {
        tokenGroup.style.display = 'none';
      }
      
      // Apply dark mode to options page if enabled
      if (darkMode) {
        document.body.classList.add('dark-theme');
      }
    }
  );
  
  // Show/hide token input when implementation changes
  implementationRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'api' && radio.checked) {
        tokenGroup.style.display = 'block';
      } else if (radio.value === 'iframe' && radio.checked) {
        tokenGroup.style.display = 'none';
      }
    });
  });
  
  // Save options
  saveButton.addEventListener('click', () => {
    const implementation = document.querySelector('input[name="implementation"]:checked').value;
    const apiToken = apiTokenInput.value;
    const darkMode = darkModeCheckbox.checked;
    const preload = preloadCheckbox.checked;
    
    chrome.storage.sync.set({
      implementation: implementation,
      apiToken: apiToken,
      darkMode: darkMode,
      preload: preload
    }, () => {
      saveMessage.style.display = 'block';
      setTimeout(() => {
        saveMessage.style.display = 'none';
      }, 3000);
    });
  });
  
  // Toggle dark mode preview in options page
  darkModeCheckbox.addEventListener('change', () => {
    if (darkModeCheckbox.checked) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  });
});
