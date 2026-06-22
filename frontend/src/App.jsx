import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import ArticleSubmission from './pages/ArticleSubmission';
import Login from './pages/Login';
import PayUSimulator from './pages/PayUSimulator';
import RegistrationSuccess from './pages/RegistrationSuccess';
import BrochureGallery from './pages/BrochureGallery';
import ToxIQUEST from './pages/ToxIQUEST';
import AbstractGuidelines from './pages/AbstractGuidelines';

// Admin imports
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrations from './pages/AdminRegistrations';
import AdminArticles from './pages/AdminArticles';
import AdminCMS from './pages/AdminCMS';
import AdminFormBuilder from './pages/AdminFormBuilder';
import AdminPayments from './pages/AdminPayments';
import AdminReports from './pages/AdminReports';

function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [fadePreloader, setFadePreloader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadePreloader(true);
      const hideTimer = setTimeout(() => {
        setShowPreloader(false);
      }, 600);
      return () => clearTimeout(hideTimer);
    }, 1200); // 1.2s of full glow is perfect

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPreloader && (
        <div className={`preloader-container ${fadePreloader ? 'preloader-hidden' : ''}`}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="preloader-spinner"></div>
            <div 
              className="preloader-logo-pulse"
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                zIndex: 10
              }}
            >
              <span 
                style={{ 
                  fontFamily: "'Raleway', sans-serif", 
                  fontWeight: 900, 
                  fontSize: '1.8rem', 
                  letterSpacing: '2px',
                  color: '#ffffff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}
              >
                TOXIQ
              </span>
              <span 
                style={{ 
                  fontFamily: "'Raleway', sans-serif", 
                  fontWeight: 800, 
                  fontSize: '0.68rem', 
                  letterSpacing: '3px',
                  color: '#2dd4bf',
                  marginTop: '4px',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 5px rgba(0,0,0,0.5)'
                }}
              >
                2026
              </span>
            </div>
          </div>
        </div>
      )}

      <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/article-submission" element={<ArticleSubmission />} />
      <Route path="/login" element={<Login />} />
      <Route path="/payment/simulator" element={<PayUSimulator />} />
      <Route path="/registration/success" element={<RegistrationSuccess />} />
      <Route path="/brochure-gallery" element={<BrochureGallery />} />
      <Route path="/toxiquest" element={<ToxIQUEST />} />
      <Route path="/abstract-guidelines" element={<AbstractGuidelines />} />

      {/* Admin Panel Nested Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="form-builder" element={<AdminFormBuilder />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
  );
}

export default App;
