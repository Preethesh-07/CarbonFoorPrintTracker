import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Main Pages
import Dashboard from './components/dashboard/Dashboard';
import LogActivity from './components/activities/LogActivity';
import Tips from './components/tips/Tips';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Alert />
          <main className="container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/log-activity" element={
                <PrivateRoute>
                  <LogActivity />
                </PrivateRoute>
              } />
              <Route path="/tips" element={
                <PrivateRoute>
                  <Tips />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;