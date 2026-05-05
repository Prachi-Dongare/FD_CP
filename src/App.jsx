import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Roles from './pages/Roles';
import FarmerDashboard from './pages/FarmerDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Policies from './pages/Policies';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();
  
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/roles" />;
  
  return children;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
      <Route path="/farmer" element={<ProtectedRoute allowedRoles={['Farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/expert" element={<ProtectedRoute allowedRoles={['Expert']}><ExpertDashboard /></ProtectedRoute>} />
      <Route path="/policies" element={<Policies />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
