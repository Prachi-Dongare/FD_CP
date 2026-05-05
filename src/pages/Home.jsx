import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Shield, MessageSquare, Camera, Users, MapPin, ArrowRight, TrendingUp, Cloud } from 'lucide-react';
import Navbar from '../components/Navbar';
import TiltCard from '../components/TiltCard';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

const Home = () => {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Hero Section with Parallax Background */}
      <section className="hero">
        <motion.div className="hero-bg-container" style={{ y: y1 }}>
          <img src="/hero-bg.png" alt="Agricultural Landscape" className="hero-bg-image" />
          <div className="hero-overlay" />
        </motion.div>

        <motion.div 
          className="hero-content"
          style={{ opacity }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge-dot"></span> {t('welcome')}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroSub')}</p>
            <div className="hero-actions">
              <Link to="/login" className="btn-primary">
                {t('getStarted')} <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Spacious Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Grow Smarter, Not Harder
          </motion.h2>
          <p>Cutting-edge tools designed for modern agriculture.</p>
        </div>

        <div className="features-grid">
          {[
            { icon: <Shield size={30} />, title: 'AI Crop Advisory', desc: 'Instant crop, pest & irrigation guidance tailored to farmer needs with precision agriculture insights.' },
            { icon: <MessageSquare size={24} />, title: 'Voice & Chatbot', desc: 'Ask questions in your local language using text or voice with our multilingual AI assistant.' },
            { icon: <Camera size={24} />, title: 'Image Recognition', desc: 'Upload images of crops for instant diagnosis of diseases, pests, and nutrient deficiencies.' },
            { icon: <Users size={24} />, title: 'Expert Connect', desc: 'Seamless escalation to agricultural experts when our AI needs human intelligence.' },
            { icon: <MapPin size={24} />, title: 'Localized Advice', desc: 'Location-specific recommendations based on soil data, weather patterns, and regional best practices.' }
          ].map((f, i) => (
            <TiltCard key={i} className="feature-card">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="item-icon">{f.icon}</div>
                <div className="item-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* More Complex How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>The AgriAI Journey</h2>
          <p>A seamless path from data to discovery.</p>
        </div>
        <div className="steps-wrapper">
          <div className="connecting-line" />
          {[
            { id: 1, title: 'Connect Your Farm', desc: 'Set up your profile with your location and crop types.' },
            { id: 2, title: 'Analyze Data', desc: 'Input soil tests or upload images for AI analysis.' },
            { id: 3, title: 'Receive Advice', desc: 'Get actionable, tailored recommendations instantly.' },
            { id: 4, title: 'Scale Yields', desc: 'Monitor progress and maximize your farming profit.' }
          ].map((s, idx) => (
            <motion.div 
              key={s.id} 
              className="step-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-circle">{s.id}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Policies Section with Pop-up effect */}
      <section className="policies-preview-section">
        <div className="section-header">
          <h2>Agricultural Policies</h2>
          <p>Stay informed with the latest government initiatives and schemes.</p>
        </div>
        <div className="policies-preview-grid">
          {[
            { title: "Crop Insurance Scheme", desc: "Government backed protection against crop loss due to natural calamities." },
            { title: "Minimum Support Price", desc: "Ensuring farmers get fair prices for their produce through government procurement." },
            { title: "Soil Health Mission", desc: "Guidance and subsidies for better soil quality and sustainable farming." }
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', duration: 0.8, delay: i * 0.1 }}
            >
              <TiltCard className="policy-preview-card">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA - Aligned and Styled like reference */}
      <section className="cta-section-new">
        <div className="cta-background-image">
          <img src="/hero-bg.png" alt="Nature Background" />
          <div className="cta-overlay" />
        </div>
        <motion.div 
          className="cta-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Join AgriAI Today</h2>
          <p>Empowering every farmer with knowledge, AI, and insights.</p>
          <Link to="/login" className="btn-cta">
            Get Started <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 AgriAI. Precision Agriculture for a Sustainable Future.</p>
      </footer>
    </div>
  );
};

export default Home;
