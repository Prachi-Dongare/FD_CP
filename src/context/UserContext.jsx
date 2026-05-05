import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedRole = localStorage.getItem('userRole');
      if (storedUser && storedUser !== 'undefined') {
        setUser({ ...JSON.parse(storedUser), role: storedRole });
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify({ name: userData.name, email: userData.email }));
    if (userData.role) localStorage.setItem('userRole', userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  const selectRole = (role) => {
    setUser(prev => {
      const updated = { ...prev, role };
      localStorage.setItem('currentUser', JSON.stringify({ name: updated.name, email: updated.email }));
      localStorage.setItem('userRole', role);
      return updated;
    });
  };

  const updateProfile = (profileData) => {
    if (!profileData) return;
    setUser(prev => {
      const updated = { ...prev, name: profileData.fullName || prev.name };
      localStorage.setItem('currentUser', JSON.stringify({ name: updated.name, email: updated.email }));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, selectRole, updateProfile, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
