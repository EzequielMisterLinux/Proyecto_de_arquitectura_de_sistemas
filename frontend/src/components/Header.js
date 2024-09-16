import { logoutUser } from '../services/api';


export const Header = () => {
    const header = document.createElement('header');
    header.className = 'p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-between items-center shadow-lg rounded-lg backdrop-blur-md';
  
    const title = document.createElement('h1');
    title.textContent = 'User Management';
    title.className = 'text-xl font-semibold';
  
    const userInfo = document.createElement('div');
    userInfo.innerHTML = `<button id="logout" class="text-white font-semibold">Logout</button>`;
  
    header.appendChild(title);
    header.appendChild(userInfo);
  
    userInfo.querySelector('#logout').addEventListener('click', async () => {
      try {
        await logoutUser();
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    });
  
    return header;
  };