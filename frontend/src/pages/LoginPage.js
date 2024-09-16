import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const page = document.createElement('div');
  page.className = 'flex items-center justify-center min-h-screen bg-gray-100';
  
  const loginForm = LoginForm();
  page.appendChild(loginForm);

  return page;
};
