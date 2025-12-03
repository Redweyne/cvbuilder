import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Layout from './Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MyCVs from './pages/MyCVs';
import CVEditor from './pages/CVEditor';
import JobOffers from './pages/JobOffers';
import Templates from './pages/Templates';
import TailorCV from './pages/TailorCV';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
          <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
          <Route path="/Dashboard" element={<Layout currentPageName="Dashboard"><Dashboard /></Layout>} />
          <Route path="/MyCVs" element={<Layout currentPageName="MyCVs"><MyCVs /></Layout>} />
          <Route path="/CVEditor" element={<Layout currentPageName="CVEditor"><CVEditor /></Layout>} />
          <Route path="/JobOffers" element={<Layout currentPageName="JobOffers"><JobOffers /></Layout>} />
          <Route path="/Templates" element={<Layout currentPageName="Templates"><Templates /></Layout>} />
          <Route path="/TailorCV" element={<Layout currentPageName="TailorCV"><TailorCV /></Layout>} />
          <Route path="/Settings" element={<Layout currentPageName="Settings"><Settings /></Layout>} />
          <Route path="/Billing" element={<Layout currentPageName="Billing"><Billing /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
