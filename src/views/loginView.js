const LoginView = () => {
  const container = document.createElement('section');
  container.setAttribute('tabindex', '-1');
  container.innerHTML = `
    <div class="main-content">
      <div class="auth-container">
        <h2>Login</h2>
        <form id="login-form" aria-label="Login form">
          <label for="email">Email:</label>
          <input id="email" name="email" type="email" required autocomplete="username" />
          <label for="password">Password:</label>
          <input id="password" name="password" type="password" required autocomplete="current-password" />
          <button type="submit">Login</button>
        </form>
        <p id="login-error" style="color:red; display:none;"></p>
      </div>
    </div>`;

  return {
    el: container,
    getForm: () => container.querySelector('#login-form'),
    showError: (message) => {
      const errorEl = container.querySelector('#login-error');
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    },
    clearError: () => {
      const errorEl = container.querySelector('#login-error');
      errorEl.style.display = 'none';
    },
  };
};

export default LoginView;
