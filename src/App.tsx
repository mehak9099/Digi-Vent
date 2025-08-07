import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import VolunteerDashboard from './pages/VolunteerDashboard';
import AvailabilityPage from './pages/AvailabilityPage';
import FeedbackPage from './pages/FeedbackPage';
import EventPublicView from './pages/EventPublicView';
import VolunteerManagement from './pages/VolunteerManagement';
import BudgetExpenses from './pages/BudgetExpenses';
import PublicEventsPage from './pages/PublicEventsPage';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import DemoModeIndicator from './components/DemoModeIndicator';
import { supabase } from './lib/supabase';

function App() {
  const isDemoMode = !supabase;

  return (
    <>
      {isDemoMode && <DemoModeIndicator />}
      <Routes>
        {/* Public Routes */}
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
        
        {/* Authentication Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/volunteer-registration" element={<RegisterPage />} />
        
        {/* Public Event Routes */}
        <Route path="/events" element={<PublicEventsPage />} />
        <Route path="/event/:eventId" element={<EventPublicView />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/events/create" element={
          <ProtectedRoute>
            <EventCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/events/edit/:eventId" element={
          <ProtectedRoute>
            <EventCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/events/duplicate/:eventId" element={
          <ProtectedRoute>
            <EventCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/admin/volunteers" element={
          <ProtectedRoute>
            <VolunteerManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/expenses" element={
          <ProtectedRoute>
            <BudgetExpenses />
          </ProtectedRoute>
        } />
        
        {/* Protected Volunteer Routes */}
        <Route path="/dashboard/volunteer" element={
          <ProtectedRoute requiredRole="volunteer">
            <VolunteerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/availability" element={
          <ProtectedRoute>
            <AvailabilityPage />
          </ProtectedRoute>
        } />
        
        {/* Protected General Routes */}
        <Route path="/tasks/board" element={
          <ProtectedRoute>
            <TaskBoard />
          </ProtectedRoute>
        } />
        <Route path="/admin/kanban" element={
          <ProtectedRoute>
            <TaskBoard />
          </ProtectedRoute>
        } />
        <Route path="/kanban" element={
          <ProtectedRoute>
            <TaskBoard />
          </ProtectedRoute>
        } />
        
        {/* Feedback Route */}
        <Route path="/feedback" element={<FeedbackPage />} />
        
        {/* Error Routes */}
        <Route path="/404" element={<ErrorPage errorType="404" />} />
        <Route path="/403" element={<ErrorPage errorType="403" />} />
        <Route path="/500" element={<ErrorPage errorType="500" />} />
        
        {/* Catch all route - redirect to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;