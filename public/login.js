// login.js

// Function to check token validity by fetching user profile
async function verifyToken(token) {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error('Invalid token');
  
      // Optionally, you can process the user data here
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
  
  // Auto-login: Redirect to tasks page if valid token exists
  window.onload = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        window.location.href = 'tasks.html'; // Adjust path if necessary
      } else {
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
  };

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = '/tasks.html'; // Redirect to tasks page
    } else {
      alert('Login failed: ' + data.error);
    }
  });
  