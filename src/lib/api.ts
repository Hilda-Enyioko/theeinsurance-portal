 import axios from 'axios';
 
 const API_BASE_URL = 'http://localhost:8000/api';
 
 export const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
     'Content-Type': 'application/json',
   },
 });
 
 // Request interceptor to add JWT token
 api.interceptors.request.use(
   (config) => {
     const token = localStorage.getItem('access_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   },
   (error) => {
     return Promise.reject(error);
   }
 );
 
 // Response interceptor to handle token refresh
 api.interceptors.response.use(
   (response) => response,
   async (error) => {
     const originalRequest = error.config;
     
     if (error.response?.status === 401 && !originalRequest._retry) {
       originalRequest._retry = true;
       
       try {
         const refreshToken = localStorage.getItem('refresh_token');
         if (refreshToken) {
           const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
             refresh: refreshToken,
           });
           
           const { access } = response.data;
           localStorage.setItem('access_token', access);
           
           originalRequest.headers.Authorization = `Bearer ${access}`;
           return api(originalRequest);
         }
       } catch (refreshError) {
         // Refresh failed, clear tokens and redirect to login
         localStorage.removeItem('access_token');
         localStorage.removeItem('refresh_token');
         localStorage.removeItem('user');
         localStorage.removeItem('user_role');
         window.location.href = '/login';
       }
     }
     
     return Promise.reject(error);
   }
 );
 
 // Auth API
 export const authApi = {
   login: (email: string, password: string) =>
     api.post('/auth/login/', { email, password }),
   
   adminLogin: (email: string, password: string) =>
     api.post('/auth/admin/login/', { email, password }),
   
   register: (data: { email: string; password: string; first_name?: string; last_name?: string }) =>
     api.post('/auth/register/', data),
   
   logout: () => api.post('/auth/logout/'),
   
   refreshToken: (refresh: string) =>
     api.post('/auth/token/refresh/', { refresh }),
 };
 
 // Property Categories API
 export const categoriesApi = {
   getAll: (params?: { page?: number; page_size?: number }) =>
     api.get('/property-categories/', { params }),
   
   getById: (id: number) =>
     api.get(`/property-categories/${id}/`),
   
   create: (data: { name: string; description?: string }) =>
     api.post('/property-categories/', data),
   
   update: (id: number, data: { name?: string; description?: string }) =>
     api.patch(`/property-categories/${id}/`, data),
   
   delete: (id: number) =>
     api.delete(`/property-categories/${id}/`),
 };
 
 // Insurance Plans API
 export const plansApi = {
   getAll: (params?: { 
     page?: number; 
     page_size?: number; 
     property_category?: number;
     ordering?: string;
     search?: string;
   }) => api.get('/insurance-plans/', { params }),
   
   getById: (id: number) =>
     api.get(`/insurance-plans/${id}/`),
   
   create: (data: { 
     name: string; 
     price: number; 
     duration_months: number;
     property_category: number;
     description?: string;
   }) => api.post('/insurance-plans/', data),
   
   update: (id: number, data: Partial<{
     name: string;
     price: number;
     duration_months: number;
     property_category: number;
     description?: string;
   }>) => api.patch(`/insurance-plans/${id}/`, data),
   
   delete: (id: number) =>
     api.delete(`/insurance-plans/${id}/`),
 };
 
 // Policy Subscriptions API
 export const subscriptionsApi = {
   getAll: (params?: { page?: number; page_size?: number; user?: number }) =>
     api.get('/policy-subscriptions/', { params }),
   
   getById: (id: number) =>
     api.get(`/policy-subscriptions/${id}/`),
   
   create: (data: { insurance_plan: number; start_date: string }) =>
     api.post('/policy-subscriptions/', data),
   
   delete: (id: number) =>
     api.delete(`/policy-subscriptions/${id}/`),
 };
 
 export default api;