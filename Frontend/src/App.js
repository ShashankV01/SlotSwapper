import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Requests from './pages/Requests';
import { getMe } from './services/api';

function App(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    const data = localStorage.getItem('ss_user');
    const token = localStorage.getItem('ss_token');
    if (data && token) {
      setUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Dashboard</Link> { ' | ' }
        <Link to="/marketplace">Marketplace</Link> { ' | ' }
        <Link to="/requests">Requests</Link>
        <span style={{ float: 'right' }}>
          {user ? (<>
            Hello, {user.name} <button onClick={handleLogout}>Logout</button>
          </>) : (<>
            <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
          </>)}
        </span>
      </nav>

      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/" element={
            <ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute user={user}><Marketplace /></ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute user={user}><Requests /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function ProtectedRoute({ user, children }){
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default App;
