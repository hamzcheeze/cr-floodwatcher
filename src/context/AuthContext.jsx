import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const login = (username, password) => {
    if (username === 'nickel' && password === 'lekcin') {
      setUserRole('admin');
      localStorage.setItem('userRole', 'admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserRole('guest');
    localStorage.removeItem('userRole');
  };

  const setGuestMode = () => {
    setUserRole('guest');
    localStorage.setItem('userRole', 'guest');
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout, setGuestMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
