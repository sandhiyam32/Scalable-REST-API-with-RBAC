import { createContext, useContext, useState } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    const profile = await authService.profile();
    localStorage.setItem('user', JSON.stringify(profile.data));
    setUser(profile.data);
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) await authService.logout(refresh).catch(() => {});
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
