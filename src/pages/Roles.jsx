import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, GraduationCap, Building2, ArrowRight, Check, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import PhotoBackground from '../components/PhotoBackground';
import './Roles.css';

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [regData, setRegData] = useState({});
  
  useEffect(() => {
    if (selectedRole) {
      const stored = localStorage.getItem(`profileData_${selectedRole.id}`);
      if (stored) {
        setRegData(JSON.parse(stored));
      } else {
        setRegData({});
      }
    }
  }, [selectedRole]);
  const { user, selectRole, updateProfile } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // No redirect here to prevent blank screen issues

  const roles = [
    {
      id: 'Farmer',
      icon: <Leaf />,
      title: t('farmer'),
      desc: 'Access personalized advice, weather alerts, and crop management tools.',
      features: ['Crop Recommendations', 'Weather Alerts', 'Market Trends'],
      color: '#2e8b57',
      path: '/farmer'
    },
    {
      id: 'Expert',
      icon: <GraduationCap />,
      title: t('expert'),
      desc: 'Provide guidance, analyze farm data, and help the community.',
      features: ['Answer Queries', 'Data Analysis', 'Knowledge Sharing'],
      color: '#4a90e2',
      path: '/expert'
    },
    {
      id: 'Policymaker',
      icon: <Building2 />,
      title: t('govPolicies'),
      desc: t('heroSub'),
      features: ['Scheme Details', 'Application Links', 'Financial Support'],
      color: '#f4a261',
      path: '/policies'
    }
  ];

  const handleContinueClick = (role) => {
    setSelectedRole(role);
    const stored = localStorage.getItem(`profileData_${role.id}`);
    if (stored) {
      selectRole(role.id);
      navigate(role.path);
    } else {
      setShowModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    // Save registration data to localStorage per role
    localStorage.setItem(`profileData_${selectedRole.id}`, JSON.stringify(regData));
    
    // Sync profile name with app state
    updateProfile(regData);
    
    // Update local context
    selectRole(selectedRole.id);
    
    // Short timeout to ensure state is processed
    setTimeout(() => {
      navigate(selectedRole.path);
    }, 100);
  };

  const renderModalFields = () => {
    if (!selectedRole) return null;

    switch (selectedRole.id) {
      case 'Farmer':
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={regData.fullName || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Region/Farm Location</label>
              <input type="text" name="region" placeholder="Enter your region" value={regData.region || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Main Crops</label>
              <input type="text" name="crops" placeholder="What crops do you grow?" value={regData.crops || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Farming Experience (years)</label>
              <input type="number" name="experience" placeholder="Years of experience" value={regData.experience || ''} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 'Expert':
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={regData.fullName || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Area of Expertise</label>
              <input type="text" name="expertise" placeholder="Soil science, irrigation, crops, etc." value={regData.expertise || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Qualifications</label>
              <input type="text" name="qualifications" placeholder="Degrees, certifications" value={regData.qualifications || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" name="experience" placeholder="Years of experience" value={regData.experience || ''} onChange={handleInputChange} required />
            </div>
          </>
        );
      case 'Policymaker':
        return (
          <>
            <div className="form-group">
              <label>{t('fullName')}</label>
              <input type="text" name="fullName" placeholder="Enter your full name" value={regData.fullName || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Organization/Department</label>
              <input type="text" name="org" placeholder="Your organization" value={regData.org || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Position/Role</label>
              <input type="text" name="role" placeholder="Your position" value={regData.role || ''} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Region Focus</label>
              <input type="text" name="regionFocus" placeholder="Region of focus" value={regData.regionFocus || ''} onChange={handleInputChange} required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="roles-container">
      <PhotoBackground />
      <Navbar />
      <div className="roles-content">
        <motion.div
          className="roles-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{t('howToUse')}</h1>
          <p>{t('selectRole')}</p>
        </motion.div>

        <div className="roles-grid">
          {roles.map((role, idx) => (
            <div key={role.id} className="role-card-container">
              <motion.div
                className={`role-card ${selectedRole?.id === role.id ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedRole(role)}
              >
                <div className="role-icon-wrapper" style={{ backgroundColor: role.color + '15', color: role.color }}>
                  {role.icon}
                </div>
                <h3>{role.title}</h3>
                <p>{role.desc}</p>
                <ul className="role-features">
                  {role.features.map(f => (
                    <li key={f}><Check size={14} /> {f}</li>
                  ))}
                </ul>
              </motion.div>

              <AnimatePresence>
                {selectedRole?.id === role.id && (
                  <motion.div
                    className="role-card-footer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <button className="btn-continue" onClick={() => handleContinueClick(role)}>
                      {t('continueAs')} {role.title} <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showModal && (
            <div className="modal-overlay">
              <motion.div 
                className="registration-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
                <div className="modal-header">
                  <h2>{selectedRole?.title} Registration</h2>
                  <div className="header-line" />
                </div>
                <form className="registration-form" onSubmit={handleFinalSubmit}>
                  {renderModalFields()}
                  <div className="modal-actions">
              <button type="submit" className="btn-modal-submit">{t('submit')}</button>
              <button type="button" className="btn-modal-skip" onClick={() => {
                          const stored = localStorage.getItem(`profileData_${selectedRole.id}`);
                          if (stored) updateProfile(JSON.parse(stored));
                          selectRole(selectedRole.id);
                          navigate(selectedRole.path);
                        }}>{t('getStarted')}</button>
                    <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Roles;
