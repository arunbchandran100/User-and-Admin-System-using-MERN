import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Add these imports at the top of your App.jsx file
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? (
            <>
              <Navbar />
              <Home />
            </>
          ) : <Navigate to="/login" />} />
          
          <Route path="/profile" element={user ? (
            <>
              <Navbar />
              <UserProfile />
            </>
          ) : <Navigate to="/login" />} />
          
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          // Then in your Routes component, add these routes:
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
