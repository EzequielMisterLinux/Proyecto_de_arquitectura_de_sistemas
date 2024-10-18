import { Header } from '../components/Header';
import { UserList } from '../components/UserList';
import { getCurrentApellidos, getCurrentUsername, getCurrentUserRole, isUserLoggedIn } from '../services/api';



export const HomePage = async () => {
  const page = document.createElement('div');
  page.className = 'min-h-screen bg-gray-100';

  if (!isUserLoggedIn()) {
    window.location.href = '/login';
    return page;
  }

  const userRole = getCurrentUserRole();

  const names = getCurrentUsername();

  const apellidos = getCurrentApellidos();

  switch (userRole) {
    case 'admin':
      
      const header = Header();
      page.appendChild(header);

      const content = document.createElement('div');
      content.className = 'container mx-auto mt-8 p-4';

      const welcomeMessage = document.createElement('h2');
      welcomeMessage.className = 'text-2xl font-bold mb-4';
      welcomeMessage.textContent = `welcome ${names} ${apellidos}`;
      content.appendChild(welcomeMessage);

      const userList = await UserList();
      content.appendChild(userList);

      page.appendChild(content);
      
      
      break;
    case 'student':
      
      window.location.href = '/student-dashboard';
      break;
    case 'teacher':
      window.location.href='/teacher-dashboard';
      break;
    default:
      content.innerHTML = '<p>Invalid user role.</p>';
  }

  return page;
};