import * as authApi from '../api/auth.js';

const authModel = {
  async loginUser(credentials) {
    return authApi.loginUser(credentials);
  },
  async registerUser(data) {
    return authApi.registerUser(data);
  },
  saveToken(token) {
    localStorage.setItem('token', token);
  },
  getToken() {
    return localStorage.getItem('token');
  }
};

export default authModel;