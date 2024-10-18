import './index.css'
import { LoginPage } from './src/pages/LoginPage';
import { HomePage } from './src/pages/HomePage';
import { StudentDashboard } from './src/pages/StudentDashboard';
import { TeacherDashboard } from './src/pages/TeacherDashboard';
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
  console.log('Rendering page. Current path:', window.location.pathname);
  app.innerHTML = '';
  const isAuthenticated = await checkAuth();
  const userRole = localStorage.getItem('userRole');
  console.log('User authenticated:', isAuthenticated, 'User role:', userRole);

  if (isAuthenticated) {
    switch (window.location.pathname) {
      case '/':
        if (userRole === 'admin') {
          console.log('Rendering HomePage for admin');
          app.appendChild(await HomePage());
        } else if (userRole === 'student') {
          console.log('Redirecting student to student dashboard');
          window.location.href = '/student-dashboard';
        } else if (userRole === 'teacher') {
          console.log('Redirecting teacher to teacher dashboard');
          window.location.href = '/teacher-dashboard';
        }
        break;
      case '/student-dashboard':
        if (userRole === 'student') {
          console.log('Rendering StudentDashboard');
          app.appendChild(StudentDashboard());
        } else {
          console.log('Unauthorized access to student dashboard, redirecting to home');
          window.location.href = '/';
        }
        break;
      case '/teacher-dashboard':
        if (userRole === 'teacher') {
          console.log('Rendering TeacherDashboard');
          app.appendChild(TeacherDashboard());

        } else {
          console.log('Unauthorized access to teacher dashboard, redirecting to home');
          window.location.href = '/';
        }
        break;
      default:
        console.log('Unknown route, redirecting to home');
        window.location.href = '/';
    }
  } else {
        if (userRole === 'student') {
      console.log('Rendering StudentDashboard');
      app.appendChild(StudentDashboard());

    }else if (userRole === 'teacher') {
      console.log('Rendering TeacherDashboard');
      app.appendChild(TeacherDashboard());
    }else{
      console.log('User not authenticated, rendering LoginPage');
    app.appendChild(LoginPage());
    }
    
  }
};

renderPage();

window.addEventListener('popstate', renderPage);

window.navigateTo = (path) => {
  console.log('Navigating to:', path);
  history.pushState(null, '', path);
  renderPage();
};

export { renderPage };