 import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
 import { User, UserRole } from '@/types';
 import { authApi } from '@/lib/api';
 
 interface AuthContextType {
   user: User | null;
   userRole: UserRole | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (email: string, password: string) => Promise<void>;
   adminLogin: (email: string, password: string) => Promise<void>;
   register: (data: { email: string; password: string; first_name?: string; last_name?: string }) => Promise<void>;
   logout: () => void;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [userRole, setUserRole] = useState<UserRole | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   useEffect(() => {
     // Check for existing auth on mount
     const storedUser = localStorage.getItem('user');
     const storedRole = localStorage.getItem('user_role') as UserRole | null;
     const accessToken = localStorage.getItem('access_token');
 
     if (storedUser && accessToken) {
       try {
         setUser(JSON.parse(storedUser));
         setUserRole(storedRole);
       } catch {
         // Invalid stored data, clear it
         localStorage.removeItem('user');
         localStorage.removeItem('user_role');
         localStorage.removeItem('access_token');
         localStorage.removeItem('refresh_token');
       }
     }
     setIsLoading(false);
   }, []);
 
   const login = useCallback(async (email: string, password: string) => {
     const response = await authApi.login(email, password);
     const { access, refresh, user: userData } = response.data;
     
     localStorage.setItem('access_token', access);
     localStorage.setItem('refresh_token', refresh);
     localStorage.setItem('user', JSON.stringify(userData));
     localStorage.setItem('user_role', 'customer');
     
     setUser(userData);
     setUserRole('customer');
   }, []);
 
   const adminLogin = useCallback(async (email: string, password: string) => {
     const response = await authApi.adminLogin(email, password);
     const { access, refresh, user: userData } = response.data;
     
     localStorage.setItem('access_token', access);
     localStorage.setItem('refresh_token', refresh);
     localStorage.setItem('user', JSON.stringify(userData));
     localStorage.setItem('user_role', 'admin');
     
     setUser(userData);
     setUserRole('admin');
   }, []);
 
   const register = useCallback(async (data: { email: string; password: string; first_name?: string; last_name?: string }) => {
     const response = await authApi.register(data);
     const { access, refresh, user: userData } = response.data;
     
     localStorage.setItem('access_token', access);
     localStorage.setItem('refresh_token', refresh);
     localStorage.setItem('user', JSON.stringify(userData));
     localStorage.setItem('user_role', 'customer');
     
     setUser(userData);
     setUserRole('customer');
   }, []);
 
   const logout = useCallback(() => {
     localStorage.removeItem('access_token');
     localStorage.removeItem('refresh_token');
     localStorage.removeItem('user');
     localStorage.removeItem('user_role');
     setUser(null);
     setUserRole(null);
   }, []);
 
   return (
     <AuthContext.Provider
       value={{
         user,
         userRole,
         isAuthenticated: !!user,
         isLoading,
         login,
         adminLogin,
         register,
         logout,
       }}
     >
       {children}
     </AuthContext.Provider>
   );
 }
 
 export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
 }