import { LoginForm } from '../components/LoginForm';
import { loginUser } from '../services/api';

export const LoginPage = () => {
  const page = document.createElement('div');
  page.className = 'flex items-center justify-center min-h-screen bg-gray-100';

  const loginForm = LoginForm(); // Renderizamos el formulario de login
  page.appendChild(loginForm);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('#email').value;
    const password = loginForm.querySelector('#password').value;

    try {
      const userData = await loginUser({ email, password });
      if (userData.role === 'student') {
        window.location.href = '/student-dashboard';
      } else if (userData.role === 'teacher') {
        window.location.href = '/teacher-dashboard';
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  });

  return page;
};
