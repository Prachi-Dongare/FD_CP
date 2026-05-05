import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CheckCircle, Clock, Send, Calendar, Search, RefreshCw, BookOpen, PlusCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import './ExpertDashboard.css';

const API_BASE_URL = "http://localhost:5001";

 const ExpertDashboard = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('queries'); // 'queries' or 'blogs'
  const [queries, setQueries] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeQuery, setActiveQuery] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [blogData, setBlogData] = useState({ title: '', content: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('profileData_Expert');
    if (stored) setProfileData(JSON.parse(stored));
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/escalations/pending`);
      setQueries(response.data);
    } catch (err) {
      console.error("Failed to fetch escalations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(response.data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    fetchQueries();
    fetchBlogs();
  }, []);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !activeQuery) return;

    try {
      await axios.post(`${API_BASE_URL}/escalations/respond`, {
        id: activeQuery.id,
        answer: answerText
      });
      
      // Update local state by removing from pending and possibly adding to a 'resolved' list if we had one
      setQueries(queries.filter(q => q.id !== activeQuery.id));
      setAnswerText('');
      setActiveQuery(null);
      alert("Response sent successfully! The farmer has been notified.");
    } catch (err) {
      alert("Failed to send response: " + (err.response?.data?.message || err.message));
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/blogs`, {
        expert_name: user?.name || "Expert",
        expert_email: user?.email || "expert@agriai.com",
        ...blogData
      });
      alert("Blog published successfully!");
      setBlogData({ title: '', content: '', image_url: '' });
      setActiveTab('blogs');
      fetchBlogs();
    } catch (err) {
      alert("Failed to post blog: " + err.message);
    }
  };

  return (
    <div className="expert-dashboard simple-bg">
      <Navbar />
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3>{t('expertProfile')}</h3>
            <p>{t('welcome')}, {user?.name}</p>
          </div>
          
          <nav className="side-nav">
            <button 
              className={`nav-item ${activeTab === 'queries' ? 'active' : ''}`} 
              onClick={() => setActiveTab('queries')}
            >
              <MessageCircle size={20} /> {t('queryHistory')}
            </button>
            <button 
              className={`nav-item ${activeTab === 'create-blog' ? 'active' : ''}`} 
              onClick={() => setActiveTab('create-blog')}
            >
              <PlusCircle size={20} /> {t('createAccount')}
            </button>
            <button 
              className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`} 
              onClick={() => setActiveTab('blogs')}
            >
              <BookOpen size={20} /> {t('govPolicies')}
            </button>
          </nav>
        </div>

        <div className="dashboard-main">
          {activeTab === 'queries' && (
            <div className="queries-container">
              <div className="content-header">
                <h2>Pending Queries ({queries.length})</h2>
                <button className="refresh-btn" onClick={fetchQueries}>
                  <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
              </div>
              <div className="queries-grid">
                {queries.map(q => (
                  <motion.div 
                    key={q.id}
                    className="query-card-compact"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveQuery(q)}
                  >
                    <div className="card-top">
                      <div className="farmer-badge">
                        <div className="mini-avatar">{q.farmer_name[0]}</div>
                        <span>{q.farmer_name}</span>
                      </div>
                      <span className="date-badge">{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="query-text">{q.query}</p>
                    <button className="respond-link">Answer Now <ArrowRight size={14} /></button>
                  </motion.div>
                ))}
                {queries.length === 0 && <p className="empty-msg">No pending queries found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'create-blog' && (
            <div className="create-blog-container">
              <div className="content-header">
                <h2>Post an Agricultural Blog</h2>
              </div>
              <form className="blog-form" onSubmit={handleBlogSubmit}>
                <div className="input-group">
                  <label>Article Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Best practices for Monsoon Wheat" 
                    value={blogData.title}
                    onChange={(e) => setBlogData({...blogData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Featured Image URL (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Paste an Unsplash image URL" 
                    value={blogData.image_url}
                    onChange={(e) => setBlogData({...blogData, image_url: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>Content</label>
                  <textarea 
                    placeholder="Share your expert knowledge here..."
                    value={blogData.content}
                    onChange={(e) => setBlogData({...blogData, content: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="post-btn">
                  Publish Article <Send size={18} />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div className="blogs-container">
              <div className="content-header">
                <h2>Your Published Articles</h2>
              </div>
              <div className="blogs-list">
                {blogs.map(blog => (
                  <div key={blog.id} className="blog-card-horizontal">
                    {blog.image_url && <img src={blog.image_url} alt="Blog" className="blog-thumb" />}
                    <div className="blog-content">
                      <h3>{blog.title}</h3>
                      <p className="blog-meta">{new Date(blog.created_at).toLocaleDateString()} • By {blog.expert_name}</p>
                      <p className="blog-excerpt">{blog.content.substring(0, 150)}...</p>
                    </div>
                  </div>
                ))}
                {blogs.length === 0 && <p className="empty-msg">You haven't posted any articles yet.</p>}
              </div>
            </div>
          )}
        </div>

        <div className="right-sidebar">
          {profileData && (
            <motion.div 
              className="profile-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3>{t('expertProfile')}</h3>
              <div className="profile-info-list">
                <div className="info-item">
                  <label>{t('fullName')}</label>
                  <p>{profileData.fullName}</p>
                </div>
                <div className="info-item">
                  <label>{t('region')}</label>
                  <p>{profileData.region || profileData.expertise}</p>
                </div>
                <div className="info-item">
                  <label>{t('experience')}</label>
                  <p>{profileData.experience} {t('years')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {activeQuery && (
            <div className="modal-overlay">
              <motion.div 
                className="response-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="modal-header">
                  <h3>Respond to {activeQuery.farmer_name}</h3>
                  <button onClick={() => setActiveQuery(null)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="query-box">
                    <strong>Farmer's Query:</strong>
                    <p>{activeQuery.query}</p>
                  </div>
                  <textarea 
                    placeholder="Type your advice here..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                </div>
                  <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setActiveQuery(null)}>Cancel</button>
                  <button className="submit-btn" onClick={handleAnswerSubmit}>Send Advice <ArrowRight size={18} /></button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExpertDashboard;
