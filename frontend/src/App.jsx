import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/Home'
import NotFound from './NotFound';
import ProfilePage from './pages/auth/Profile';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import Dashboard from './pages/homepage/Dashboard';
import EventList from './pages/homepage/EventList';
import EventForm from './pages/homepage/EventForm';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className='min-h-screen bg-slate-100'>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
        <Route path="/events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        <Route path="/events/:id/edit" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
