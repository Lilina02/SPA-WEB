const API_BASE = 'https://story-api.dicoding.dev/v1';


export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.message || 'Registration failed');
  }

  return data.message;
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.message || 'Login failed');
  }

  setAuthToken(data.loginResult.token);
  return data.loginResult;
}

export function logoutUser() {
  localStorage.removeItem('authToken');
}

export function isUserLoggedIn() {
  return !!getAuthToken();
}


export function getAuthToken() {
  return localStorage.getItem('authToken');
}
export function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}
