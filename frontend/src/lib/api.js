import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Para cookies de sessão
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

// Serviços de eventos
export const eventService = {
  // Listar todos os eventos
  getEvents: () => api.get('/events'),
  
  // Obter evento específico
  getEvent: (id) => api.get(`/events/${id}`),
  
  // Criar novo evento (organizador)
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Atualizar evento (organizador)
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  
  // Deletar evento (organizador)
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // Inscrever-se em evento
  subscribeToEvent: (id) => api.post(`/events/${id}/subscribe`),
  
  // Cancelar inscrição em evento
  unsubscribeFromEvent: (id) => api.delete(`/events/${id}/unsubscribe`),
  
  // Meus eventos (participante)
  getMyEvents: () => api.get('/my-events'),
};

export default api;
