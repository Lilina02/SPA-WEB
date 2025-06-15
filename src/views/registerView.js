const RegisterView = () => {
  const el = document.createElement('section');
  el.setAttribute('tabindex', '-1');
  el.innerHTML = `
    <div class="main-content">
      <div class="auth-container">
        <h2>Register</h2>
        <form id="register-form" aria-label="Registration form">
          <label for="name">Name:</label>
          <input id="name" name="name" type="text" required autocomplete="name" />

          <label for="email">Email:</label>
          <input id="email" name="email" type="email" required autocomplete="email" />

          <label for="password">Password:</label>
          <input id="password" name="password" type="password" required autocomplete="new-password" />

          <button type="submit">Register</button>
        </form>
        <p id="register-error" style="color:red; display:none;" aria-live="assertive"></p>
      </div>
    </div>`;

  return {
    el,
    getForm: () => el.querySelector('#register-form'),
    showError: (message) => {
      const error = el.querySelector('#register-error');
      error.textContent = message;
      error.style.display = 'block';
    },
    clearError: () => {
      const error = el.querySelector('#register-error');
      error.textContent = '';
      error.style.display = 'none';
    }
  };
};

export default RegisterView;
