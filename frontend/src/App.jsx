import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Registration from './pages/Registration';
import ArticleSubmission from './pages/ArticleSubmission';
import Login from './pages/Login';
import PayUSimulator from './pages/PayUSimulator';
import RegistrationSuccess from './pages/RegistrationSuccess';

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
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/article-submission" element={<ArticleSubmission />} />
      <Route path="/login" element={<Login />} />
      <Route path="/payment/simulator" element={<PayUSimulator />} />
      <Route path="/registration/success" element={<RegistrationSuccess />} />

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
  );
}

export default App;
