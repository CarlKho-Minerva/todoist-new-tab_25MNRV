document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  
  // Get implementation method from storage
  chrome.storage.sync.get(['implementation', 'apiToken'], (result) => {
    const implementation = result.implementation || 'iframe';
    const apiToken = result.apiToken || '';
    
    if (implementation === 'iframe') {
      loadIframe();
    } else {
      loadApiImplementation(apiToken);
    }
  });
  
  function loadIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://todoist.com/app';
    iframe.onload = () => {
      loading.classList.add('hidden');
    };
    iframe.onerror = () => {
      error.classList.remove('hidden');
      loading.classList.add('hidden');
    };
    container.appendChild(iframe);
  }
  
  function loadApiImplementation(token) {
    if (!token) {
      error.classList.remove('hidden');
      loading.classList.add('hidden');
      return;
    }
    
    // Initialize Todoist API
    fetchTasks(token);
  }
  
  function fetchTasks(token) {
    fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('API request failed');
      return response.json();
    })
    .then(tasks => {
      renderTasks(tasks);
      loading.classList.add('hidden');
    })
    .catch(err => {
      console.error('Error fetching tasks:', err);
      error.classList.remove('hidden');
      loading.classList.add('hidden');
    });
  }
  
  function renderTasks(tasks) {
    // Create a simple UI for tasks
    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task';
      taskElement.innerHTML = `
        <input type="checkbox" id="task-${task.id}">
        <label for="task-${task.id}">${task.content}</label>
      `;
      taskList.appendChild(taskElement);
    });
    
    container.appendChild(taskList);
  }
  
  // Add event listeners for buttons
  document.getElementById('options-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  document.getElementById('retry-btn').addEventListener('click', () => {
    location.reload();
  });
});
