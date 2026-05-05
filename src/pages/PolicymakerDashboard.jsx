import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Bell, 
  Map as MapIcon, 
  FileText, 
  Send,
  BarChart as BarIcon,
  Activity
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import './PolicymakerDashboard.css';

const PolicymakerDashboard = () => {
  const { user } = useUser();
  const [announcement, setAnnouncement] = useState('');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('profileData_Policymaker');
    if (stored) setProfileData(JSON.parse(stored));
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    alert(`📢 Broadcast Sent: "${announcement}"\nAll farmers in ${profileData?.regionFocus || 'the region'} have been notified.`);
    setAnnouncement('');
  };

  return (
    <div className="policymaker-dashboard">
      <Navbar />
      
      <div className="dashboard-wrapper container-fluid py-5 mt-5">
        <div className="row g-4">
          {/* Sidebar - Profile & Nav */}
          <div className="col-lg-3">
            <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
              <div className="profile-header text-center mb-4">
                <div className="avatar-lg mx-auto mb-3">
                  <Activity size={32} />
                </div>
                <h4 className="fw-bold">{profileData?.fullName || user?.name}</h4>
                <p className="text-muted">{profileData?.role || 'Senior Policymaker'}</p>
                <span className="badge bg-success-soft text-success px-3 py-2">
                  {profileData?.org || 'Agriculture Dept.'}
                </span>
              </div>

              <div className="nav flex-column nav-pills custom-nav">
                <button className="nav-link active">
                  <LayoutDashboard size={18} /> Overview
                </button>
                <button className="nav-link">
                  <MapIcon size={18} /> Regional Map
                </button>
                <button className="nav-link">
                  <FileText size={18} /> Policy Drafts
                </button>
                <button className="nav-link">
                  <Bell size={18} /> Notifications
                </button>
              </div>

              <div className="mt-5 pt-4 border-top">
                <p className="text-muted small text-uppercase fw-bold mb-3">Region Focus</p>
                <p className="fw-bold text-success"><MapIcon size={16} /> {profileData?.regionFocus || 'Maharashtra State'}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Quick Stats */}
            <div className="row g-4 mb-4">
              {[
                { label: 'Total Farmers', value: '12.4k', icon: <Users />, color: 'primary' },
                { label: 'Yield Growth', value: '+14%', icon: <TrendingUp />, color: 'success' },
                { label: 'Subsidies Disbursed', value: '₹4.2 Cr', icon: <BarIcon />, color: 'warning' },
                { label: 'Active Alerts', value: '03', icon: <Bell />, color: 'danger' }
              ].map((stat, i) => (
                <div key={i} className="col-md-3">
                  <motion.div 
                    className="stat-card p-3 shadow-sm border-0"
                    whileHover={{ y: -5 }}
                  >
                    <div className={`icon-box bg-${stat.color}-light text-${stat.color} mb-3`}>
                      {stat.icon}
                    </div>
                    <h2 className="fw-bold mb-1">{stat.value}</h2>
                    <p className="text-muted small mb-0">{stat.label}</p>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Functional Sections */}
            <div className="row g-4 mb-4">
              <div className="col-lg-12">
                <div className="glass-card p-4">
                  <h5 className="fw-bold mb-3"><Bell size={20} className="me-2 text-danger" /> Broadcast Announcement</h5>
                  <p className="text-muted small mb-4">Send an immediate notification to all farmers in your focus region.</p>
                  <form onSubmit={handleBroadcast}>
                    <div className="mb-3">
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        placeholder="Write your announcement here..."
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success px-5 py-2 fw-bold">
                      Send Broadcast <Send size={18} className="ms-2" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-12">
                <div className="glass-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0"><FileText size={20} className="me-2 text-primary" /> Active Government Schemes</h5>
                    <button className="btn btn-sm btn-primary">Add New Policy +</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Scheme Name</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'PM-Kisan', cat: 'Income Support', status: 'Active', date: 'Oct 2023' },
                          { name: 'Fasal Bima', cat: 'Insurance', status: 'Active', date: 'Sep 2023' },
                          { name: 'Kisan Credit', cat: 'Credit', status: 'Review', date: 'Nov 2023' }
                        ].map((p, i) => (
                          <tr key={i}>
                            <td className="fw-bold">{p.name}</td>
                            <td>{p.cat}</td>
                            <td><span className={`badge bg-${p.status === 'Active' ? 'success' : 'warning'}-soft text-${p.status === 'Active' ? 'success' : 'warning'}`}>{p.status}</span></td>
                            <td>{p.date}</td>
                            <td><button className="btn btn-link btn-sm text-decoration-none">Edit</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicymakerDashboard;
