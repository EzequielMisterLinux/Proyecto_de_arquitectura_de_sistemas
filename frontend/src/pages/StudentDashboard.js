import { requireAuth, hasPermission } from '../utils/authUtils';
import { Header } from '../components/Header';

export const StudentDashboard = () => {
  requireAuth(); // Verifica si está autenticado
  if (!hasPermission('student')) {
    window.location.href = '/login'; // Redirige si no es estudiante
  }

  const page = document.createElement('div');
  page.className = 'p-4';
  
  page.appendChild(Header()); // Añade el header

  const content = document.createElement('div');
  content.innerHTML = '<h1 class="text-2xl font-semibold">Student Dashboard</h1>';
  
  page.appendChild(content);
  
  return page;
};
