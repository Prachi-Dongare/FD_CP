import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import PhotoBackground from '../components/PhotoBackground';
import './Login.css';

const API_BASE_URL = "http://localhost:5001";

const Login = () => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
      
      if (isLogin) {
        login(response.data.user);
        navigate('/roles');
      } else {
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <PhotoBackground />
      <Navbar />
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-sidebar">
            <motion.div 
              className="sidebar-content"
              key={isLogin ? 'login-side' : 'signup-side'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h1>{isLogin ? 'Welcome Back!' : 'Join AgriAI'}</h1>
              <p>
                {isLogin 
                  ? 'Access your personalized farm management tools and AI insights.' 
                  : 'Start your journey towards precision agriculture today.'}
              </p>
              <button onClick={handleToggle} className="btn-toggle">
                {isLogin ? 'Create an Account' : 'Already have an account? Sign In'}
              </button>
            </motion.div>
          </div>

          <div className="auth-form-container">
            <AnimatePresence mode="wait">
              <motion.form 
                key={isLogin ? 'login-form' : 'signup-form'}
                className="auth-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
              >
                <h2>{isLogin ? t('signIn') : t('signUp')}</h2>
                
                {error && <div className="auth-error">{error}</div>}

                <div className="divider"><span>{t('orUseEmail')}</span></div>

                {!isLogin && (
                  <div className="input-group">
                    <User className="input-icon" size={20} />
                    <input 
                      type="text" 
                      name="name" 
                      placeholder={t('fullName')} 
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                <div className="input-group">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder={t('email')} 
                    required 
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <Lock className="input-icon" size={20} />
                  <input 
                    type="password" 
                    name="password" 
                    placeholder={t('password')} 
                    required 
                    onChange={handleInputChange}
                  />
                </div>

                {isLogin && <a href="#" className="forgot-pass">{t('forgotPass')}</a>}

                <button type="submit" className="btn-submit">
                  {isLogin ? t('signIn') : t('signUp')} <ArrowRight size={20} />
                </button>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
