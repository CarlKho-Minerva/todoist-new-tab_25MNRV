document.addEventListener('DOMContentLoaded', () => {
  const implementationRadios = document.querySelectorAll('input[name="implementation"]');
  const apiTokenInput = document.getElementById('api-token');
  const tokenGroup = document.getElementById('token-group');
  const saveButton = document.getElementById('save');
  const saveMessage = document.getElementById('save-message');
  
  // Load saved options
  chrome.storage.sync.get(['implementation', 'apiToken'], (result) => {
    const implementation = result.implementation || 'iframe';
    const apiToken = result.apiToken || '';
    
    // Set form values
    document.querySelector(`input[value="${implementation}"]`).checked = true;
    apiTokenInput.value = apiToken;
    
    // Show/hide token input based on implementation
    if (implementation === 'iframe') {
      tokenGroup.style.display = 'none';
    }
  });
  
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
    
    chrome.storage.sync.set({
      implementation: implementation,
      apiToken: apiToken
    }, () => {
      saveMessage.style.display = 'block';
      setTimeout(() => {
        saveMessage.style.display = 'none';
      }, 3000);
    });
  });
});
