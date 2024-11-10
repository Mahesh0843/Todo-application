const token = localStorage.getItem('token');
const pendingTaskList = document.getElementById('pendingTaskList');
const completedTaskList = document.getElementById('completedTaskList');
console.log('Token being sent:', token); 

// Fetch tasks on page load
window.onload = async function() {
  if (!token) {
    alert('Please log in first.');
    window.location.href = '/index.html'; // Redirect to login page
    return;
  }

  try {
    const res = await fetch('/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Response Status:', res.status);  // Log response status
console.log('Response Body:', await res.text()); 
    if (!res.ok) throw new Error('Failed to fetch tasks');

    const tasks = await res.json();
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    displayTasks(pendingTaskList, pendingTasks);
    displayTasks(completedTaskList, completedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Error fetching tasks.');
  }
};

// Add new task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    });

    if (!res.ok) throw new Error('Failed to add task');

    const task = await res.json();
    displayTask(pendingTaskList, task); // Display the new task in the pending list
    document.getElementById('taskForm').reset(); // Clear the form after submission
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Error adding task.');
  }
});

// Display tasks
function displayTasks(taskList, tasks) {
  taskList.innerHTML = ''; // Clear existing tasks
  tasks.forEach(task => displayTask(taskList, task));
}

// Display a single task
function displayTask(taskList, task) {
  const li = document.createElement('li');
  li.classList.add('task-item');
  li.innerHTML = `
    <strong>${task.title}</strong> - ${task.description}
    <button onclick="toggleComplete('${task._id}', ${task.completed})">
      ${task.completed ? 'Undo' : 'Complete'}
    </button>
    <button onclick="deleteTask('${task._id}')">Delete</button>`;
  
  if (task.completed) {
    li.classList.add('completed-task');
  }

  taskList.appendChild(li);
}

// Toggle task completion
async function toggleComplete(id, completed) {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: !completed })
    });

    if (!res.ok) throw new Error('Failed to update task');

    // Update the task list without reloading the page
    const taskElement = document.querySelector(`li[data-id="${id}"]`);
    if (taskElement) {
      taskElement.querySelector('button').textContent = completed ? 'Complete' : 'Undo';
      taskElement.classList.toggle('completed-task', !completed);
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task.');
  }
}

// Delete task
async function deleteTask(id) {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to delete task');

    // Remove task from the DOM
    const taskElement = document.querySelector(`li[data-id="${id}"]`);
    if (taskElement) {
      taskElement.remove();
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task.');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/index.html'; // Redirect to the login page
}
