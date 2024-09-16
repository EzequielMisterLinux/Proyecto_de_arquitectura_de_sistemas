import './index.css'
import { LoginPage } from './src/pages/LoginPage';
import { HomePage } from './src/pages/HomePage';
import api from './src/services/api';

const app = document.querySelector('#app');

const checkAuth = async () => {
  try {
    await api.get('/users');
    return true;
  } catch (error) {
    return false;
  }
};

const renderPage = async () => {
  app.innerHTML = '';
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    app.appendChild(await HomePage());
  } else {
    app.appendChild(LoginPage());
  }
};


renderPage();

window.addEventListener('popstate', renderPage);

window.navigateTo = (path) => {
  history.pushState(null, '', path);
  renderPage();
};