const token = localStorage.getItem('token');

// Fetch user profile on page load
window.onload = async function() {
  if (!token) {
    alert('Please log in first.');
    window.location.href = '/index.html';
  }

  const res = await fetch('/api/users/profile', {
    headers: { 'Authorization': token }
  });
  const user = await res.json();
  document.getElementById('profileUsername').value = user.username;
  document.getElementById('profileEmail').value = user.email;
};

// Update user profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('profileUsername').value;
  const email = document.getElementById('profileEmail').value;

  const res = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ username, email })
  });

  const data = await res.json();
  alert('Profile updated successfully!');
});
