import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta la URL base según tu backend
  withCredentials: true, // Permite cookies de autenticación
});

// Autenticar usuario y obtener token
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('userRole', response.data.role);
    localStorage.setItem('token', response.data.token); // Guarda el token en localStorage
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cerrar sesión y limpiar localStorage
export const logoutUser = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('userRole');
  localStorage.removeItem('token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Verifica si existe un token
};

export const getCurrentUserRole = () => {
  return localStorage.getItem('userRole') || 'student';
};

export const isUserLoggedIn = () => {
  return !!localStorage.getItem('userRole');
};



export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const addUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};


export default api;