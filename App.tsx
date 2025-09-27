import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';

// New Imports for Admin/Client Portal
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ClientsList from './pages/admin/ClientsList';
import ClientForm from './pages/admin/ClientForm';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectForm from './pages/admin/ProjectForm';
import AdminProjectDetailPage from './pages/admin/AdminProjectDetailPage';
import InvoicesList from './pages/admin/InvoicesList'; // New import
import CategoriesManager from './pages/admin/CategoriesManager';
import ClientPortal from './pages/client/ClientPortal';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
          <Route path="/portfolio/:id" element={<Layout><PortfolioDetailPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="owner">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/new" element={<ClientForm />} />
            <Route path="clients/edit/:id" element={<ClientForm />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="projects/:id" element={<AdminProjectDetailPage />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="invoicing" element={<InvoicesList />} /> {/* New route */}
          </Route>

          {/* Client Portal Routes */}
          <Route 
            path="/portal" 
            element={
              <ProtectedRoute role="client">
                <ClientPortal />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;