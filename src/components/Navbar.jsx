import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, LogOut, User, Globe } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <Leaf className="logo-icon" />
        <span>AgriAI</span>
      </Link>
      <div className="nav-links">
        <div className="lang-switcher">
          <Globe size={16} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>
        <Link to="/">{t('home')}</Link>
        {user && user.role === 'Farmer' && <Link to="/farmer">{t('dashboard')}</Link>}
        {user && user.role === 'Expert' && <Link to="/expert">{t('dashboard')}</Link>}
        <Link to="/policies">{t('policies')}</Link>
        {user ? (
          <div className="nav-user">
            <Link to="/roles" className="user-info">
              <User size={18} />
              <span>{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
