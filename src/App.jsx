import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyCVs from './pages/MyCVs';
import CVEditor from './pages/CVEditor';
import JobOffers from './pages/JobOffers';
import Templates from './pages/Templates';
import TailorCV from './pages/TailorCV';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import CareerDiscovery from './pages/CareerDiscovery';
import InterviewSimulator from './pages/InterviewSimulator';
import CareerMentor from './pages/CareerMentor';
import SuccessRoadmap from './pages/SuccessRoadmap';
import TemplatePreview from './pages/TemplatePreview';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/Dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
      <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
      
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/Dashboard" element={
        <ProtectedRoute>
          <Layout currentPageName="Dashboard"><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/MyCVs" element={
        <ProtectedRoute>
          <Layout currentPageName="MyCVs"><MyCVs /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/CVEditor" element={
        <ProtectedRoute>
          <Layout currentPageName="CVEditor"><CVEditor /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/JobOffers" element={
        <ProtectedRoute>
          <Layout currentPageName="JobOffers"><JobOffers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/Templates" element={
        <ProtectedRoute>
          <Layout currentPageName="Templates"><Templates /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/TailorCV" element={
        <ProtectedRoute>
          <Layout currentPageName="TailorCV"><TailorCV /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/Settings" element={
        <ProtectedRoute>
          <Layout currentPageName="Settings"><Settings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/Billing" element={
        <ProtectedRoute>
          <Layout currentPageName="Billing"><Billing /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/CareerDiscovery" element={
        <ProtectedRoute>
          <CareerDiscovery />
        </ProtectedRoute>
      } />
      <Route path="/InterviewSimulator" element={
        <ProtectedRoute>
          <Layout currentPageName="InterviewSimulator"><InterviewSimulator /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/CareerMentor" element={
        <ProtectedRoute>
          <CareerMentor />
        </ProtectedRoute>
      } />
      <Route path="/SuccessRoadmap" element={
        <ProtectedRoute>
          <Layout currentPageName="SuccessRoadmap"><SuccessRoadmap /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Public template preview - no auth required */}
      <Route path="/preview" element={<TemplatePreview />} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
