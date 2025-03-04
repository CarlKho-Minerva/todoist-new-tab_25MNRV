document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  
  // Apply system dark mode to loading screen immediately
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('system-dark');
  }
  
  // Get implementation method and dark mode preference from storage
  chrome.storage.sync.get(['implementation', 'apiToken', 'darkMode'], (result) => {
    const implementation = result.implementation || 'iframe';
    const apiToken = result.apiToken || '';
    const darkMode = result.darkMode || false;
    
    // Apply dark mode if enabled
    if (darkMode) {
      document.body.classList.add('dark-theme');
    }
    
    if (implementation === 'iframe') {
      loadIframe(darkMode);
    } else {
      loadApiImplementation(apiToken, darkMode);
    }
  });
  
  function loadIframe(darkMode) {
    const iframe = document.createElement('iframe');
    
    // Add dark mode parameter if enabled
    const todoistUrl = darkMode 
      ? 'https://todoist.com/app/today?theme=dark' 
      : 'https://todoist.com/app/today';
      
    // Set loading attributes for better performance
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('importance', 'high');
    
    // Show loading indicator
    const loadTimeout = setTimeout(() => {
      // If taking too long, show a fake progress indicator
      loading.innerHTML += '<p class="loading-message">Still working...</p>';
    }, 2000);
    
    // Handle iframe events
    iframe.onload = () => {
      clearTimeout(loadTimeout);
      loading.classList.add('hidden');
      iframe.style.opacity = '1';
    };
    
    iframe.onerror = () => {
      clearTimeout(loadTimeout);
      error.classList.remove('hidden');
      loading.classList.add('hidden');
    };
    
    // Set iframe source last to start loading
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.3s ease-in';
    container.appendChild(iframe);
    iframe.src = todoistUrl;
    
    // Fallback if iframe takes too long
    setTimeout(() => {
      if (!loading.classList.contains('hidden')) {
        loading.classList.add('hidden');
        if (iframe.style.opacity === '0') {
          iframe.style.opacity = '1';
        }
      }
    }, 5000);
  }
  
  function loadApiImplementation(token, darkMode) {
    if (!token) {
      error.classList.remove('hidden');
      loading.classList.add('hidden');
      return;
    }
    
    // Apply dark theme to container if needed
    if (darkMode) {
      container.classList.add('dark-theme');
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
    
    // Add header
    const header = document.createElement('div');
    header.className = 'task-header';
    header.innerHTML = `<h1>Today's Tasks</h1>`;
    taskList.appendChild(header);
    
    if (tasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No tasks for today. Enjoy your day!';
      taskList.appendChild(emptyState);
    } else {
      tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
          <input type="checkbox" id="task-${task.id}">
          <label for="task-${task.id}">${task.content}</label>
          ${task.due ? `<span class="due-date">${task.due.string}</span>` : ''}
        `;
        taskList.appendChild(taskElement);
      });
    }
    
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
