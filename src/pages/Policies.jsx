import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import './Policies.css';

const Policies = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const policies = [
    {
      id: 1,
      title: t('policy1_title'),
      summary: t('policy1_summary'),
      details: t('policy1_details'),
      tag: "Income Support",
      url: "https://pmkisan.gov.in/"
    },
    {
      id: 2,
      title: t('policy2_title'),
      summary: t('policy2_summary'),
      details: t('policy2_details'),
      tag: "Insurance",
      url: "https://pmfby.gov.in/"
    },
    {
      id: 3,
      title: t('policy3_title'),
      summary: t('policy3_summary'),
      details: t('policy3_details'),
      tag: "Credit",
      url: "https://www.pnbindia.in/kisan-credit-card.html"
    },
    {
      id: 4,
      title: t('policy4_title'),
      summary: t('policy4_summary'),
      details: t('policy4_details'),
      tag: "Soil Health",
      url: "https://soilhealth.dac.gov.in/"
    },
    {
      id: 5,
      title: t('policy5_title'),
      summary: t('policy5_summary'),
      details: t('policy5_details'),
      tag: "Marketing",
      url: "https://www.enam.gov.in/"
    },
    {
      id: 6,
      title: t('policy6_title'),
      summary: t('policy6_summary'),
      details: t('policy6_details'),
      tag: "Irrigation",
      url: "https://pmksy.gov.in/"
    }
  ];

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="policies-page">
      <Navbar />
      <div className="policies-container">
        <motion.div 
          className="policies-header text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="official-badge mb-3">Government of India Initiatives</div>
          <h1>{t('govPolicies')}</h1>
          <p className="lead">{t('heroSub')}</p>
          
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder={t('askAi')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="policies-grid">
          <AnimatePresence>
            {filteredPolicies.map((policy) => (
              <motion.div 
                key={policy.id}
                className={`policy-card ${expandedId === policy.id ? 'expanded' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-top" onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}>
                  <div className="policy-info">
                    <span className="tag">{policy.tag}</span>
                    <h3>{policy.title}</h3>
                    <p>{policy.summary}</p>
                  </div>
                  <div className="expand-icon">
                    {expandedId === policy.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === policy.id && (
                    <motion.div 
                      className="card-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="details-content">
                        <p>{policy.details}</p>
                        <button 
                          className="apply-btn"
                          onClick={() => window.open(policy.url, '_blank')}
                        >
                          {t('getStarted')} <ExternalLink size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPolicies.length === 0 && (
          <div className="no-results">
            <Info size={48} />
            <h3>{t('noEscalations')}</h3>
            <p>{t('back')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
