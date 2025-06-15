const RegisterPresenter = (container, model, viewFactory, viewHandler) => {
  container.innerHTML = '';

  const view = viewFactory(); // ini RegisterView()
  container.appendChild(view.el);

  const form = view.getForm();
  const submitButton = form.querySelector('button[type="submit"]');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    view.clearError();

    const formData = new FormData(form);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const password = formData.get('password')?.trim();

    if (!name || !email || !password) {
      view.showError('All fields are required');
      return;
    }
    if (!emailRegex.test(email)) {
      view.showError('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      view.showError('Password must be at least 8 characters');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Registering...';

    try {
      const message = await model.registerUser({ name, email, password });
      viewHandler(message);
    } catch (err) {
      view.showError(err.message || 'Registration failed');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Register';
    }
  });
};

export default RegisterPresenter;
