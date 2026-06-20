import { createContext, useContext, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(() => localStorage.getItem('pg_token'));
  const [username, setUsername] = useState(() => localStorage.getItem('pg_user') || '');

  function login(t, u) {
    setToken(t);
    setUsername(u);
    localStorage.setItem('pg_token', t);
    localStorage.setItem('pg_user',  u);
  }

  function logout() {
    setToken(null);
    setUsername('');
    localStorage.removeItem('pg_token');
    localStorage.removeItem('pg_user');
  }

  return (
    <AuthCtx.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
