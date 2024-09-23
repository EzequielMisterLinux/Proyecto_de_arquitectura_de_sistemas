import { requireAuth, hasPermission } from '../utils/authUtils';
import { Header } from '../components/Header';

export const TeacherDashboard = () => {
  requireAuth(); // Verifica si está autenticado
  if (!hasPermission('teacher')) {
    window.location.href = '/login'; // Redirige si no es profesor
  }

  const page = document.createElement('div');
  page.className = 'p-4';
  
  page.appendChild(Header()); // Añade el header

  const content = document.createElement('div');
  content.innerHTML = '<h1 class="text-2xl font-semibold">Teacher Dashboard</h1>';
  
  page.appendChild(content);
  
  return page;
};
