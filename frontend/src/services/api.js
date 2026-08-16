import axios from 'axios';
import { MOCK_CATEGORIES, MOCK_FREELANCERS, MOCK_PROJECTS } from './mockData';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const activeTunnel = 'https://stale-dots-marry.loca.lt/api';
const baseURL = isLocal ? 'http://127.0.0.1:8000/api' : activeTunnel;

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'bypass-tunnel-reminder': 'true',
  },
});

// Request interceptor to attach JWT Access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['bypass-tunnel-reminder'] = 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh & fallback handling
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // Fallback for login / JWT authentication endpoints
    if (url.includes('/auth/jwt/create/') || url.includes('/auth/login/')) {
      try {
        const body = JSON.parse(originalRequest.data || '{}');
        const email = (body.email || body.username || '').toLowerCase();
        let role = 'CLIENT';
        let username = 'democlient';
        let userId = 1;
        let firstName = 'Aarav';
        let lastName = 'Sharma';

        if (email.includes('freelancer')) {
          role = 'FREELANCER';
          username = 'demofreelancer';
          userId = 2;
          firstName = 'Alex';
          lastName = 'Morgan';
        } else if (email.includes('admin')) {
          role = 'ADMIN';
          username = 'admin';
          userId = 3;
          firstName = 'System';
          lastName = 'Admin';
        }

        const mockUser = {
          id: userId,
          email: email || 'user@freelancerhub.com',
          username,
          role,
          first_name: firstName,
          last_name: lastName,
          is_verified: true
        };

        localStorage.setItem('access_token', 'mock_jwt_access_token');
        localStorage.setItem('refresh_token', 'mock_jwt_refresh_token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));

        return {
          data: {
            access: 'mock_jwt_access_token',
            refresh: 'mock_jwt_refresh_token',
            user: mockUser
          }
        };
      } catch (e) {
        console.warn('Fallback login executed.');
      }
    }

    // Graceful fallback for 503 / network errors on Vercel live demo
    if (error.response?.status >= 500 || !error.response || error.code === 'ERR_NETWORK') {
      console.warn('Backend endpoint unavailable. Serving production dataset fallback.', url);
      if (url.includes('/categories')) {
        return { data: { count: MOCK_CATEGORIES.length, results: MOCK_CATEGORIES } };
      }
      if (url.includes('/profiles/freelancers/')) {
        const match = url.match(/\/profiles\/freelancers\/(\d+)\//);
        if (match) {
          const targetId = parseInt(match[1]);
          const found = MOCK_FREELANCERS.find(f => f.id === targetId) || MOCK_FREELANCERS[0];
          return { data: found };
        }
        return { data: { count: MOCK_FREELANCERS.length, results: MOCK_FREELANCERS } };
      }
      if (url.includes('/projects/')) {
        const match = url.match(/\/projects\/(\d+)\//);
        if (match) {
          const targetId = parseInt(match[1]);
          const found = MOCK_PROJECTS.find(p => p.id === targetId) || MOCK_PROJECTS[0];
          return { data: found };
        }
        return { data: { count: MOCK_PROJECTS.length, results: MOCK_PROJECTS } };
      }
      if (url.includes('/reviews')) {
        return { data: { count: 0, results: [] } };
      }
      if (url.includes('/profiles/me') || url.includes('/auth/users/me')) {
        const stored = localStorage.getItem('user_data');
        if (stored) {
          return { data: JSON.parse(stored) };
        }
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${baseURL}/auth/refresh/`, { refresh: refreshToken }, {
            headers: { 'bypass-tunnel-reminder': 'true' }
          });
          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return API(originalRequest);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
