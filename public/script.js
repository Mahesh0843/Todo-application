// Register User
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (res.status === 400 && data.error === 'User already exists') {
    alert('This email is already registered. Redirecting to the signup page...');
    window.location.href = '/signup.html';  
  } else if (data.message) {
    alert(data.message || 'Registration Successful');
    window.location.href = '/login.html';  
  }

});