const LoginPresenter = (container, model, createView, onLoginSuccess) => {
  const view = createView();
  container.innerHTML = '';
  container.appendChild(view.el);

  const form = view.getForm();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    view.clearError();

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await model.loginUser({ email, password });
      const token = result.token;
      if (!token) throw new Error('Token tidak ditemukan dari response login');

      model.saveToken(token);  
      onLoginSuccess();        
    } catch (err) {
      view.showError(err.message || 'Login gagal, coba lagi.');
    }
  });
};

export default LoginPresenter;
