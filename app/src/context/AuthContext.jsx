import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../utils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get('currentUser'));

  const login = useCallback((loginId, password) => {
    const users = storage.get('users', []);
    const found = users.find(u => u.loginId === loginId && u.password === password);
    if (!found) return 'Invalid Login ID or Password';
    storage.set('currentUser', found);
    setUser(found);
    return null;
  }, []);

  const signup = useCallback((loginId, email, password) => {
    const users = storage.get('users', []);
    if (users.some(u => u.loginId === loginId)) return 'Login ID already exists';
    if (users.some(u => u.email === email)) return 'Email already registered';
    const newUser = { id: Date.now().toString(36), loginId, email, password };
    users.push(newUser);
    storage.set('users', users);
    storage.set('currentUser', newUser);
    setUser(newUser);
    return null;
  }, []);

  const logout = useCallback(() => {
    storage.remove('currentUser');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
