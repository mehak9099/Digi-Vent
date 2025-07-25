import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Statistics from './components/Statistics';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import EventCreatePage from './pages/EventCreatePage';
import TaskBoard from './pages/TaskBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/volunteer-registration" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events/create" element={<EventCreatePage />} />
        <Route path="/admin/events/edit/:eventId" element={<EventCreatePage />} />
        <Route path="/admin/events/duplicate/:eventId" element={<EventCreatePage />} />
        <Route path="/tasks/board" element={<TaskBoard />} />
        <Route path="/admin/kanban" element={<TaskBoard />} />
        <Route path="/kanban" element={<TaskBoard />} />
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            <Header />
            <main>
              <Hero />
              <Features />
              <HowItWorks />
              <Statistics />
              <Testimonials />
              <CTA />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;