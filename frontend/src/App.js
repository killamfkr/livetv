import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import LiveTV from './pages/LiveTV';
import Login from './pages/Login';
import Register from './pages/Register';
import Player from './pages/Player';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const MainContent = styled.main`
  padding-top: 80px; /* Account for fixed navbar */
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AuthProvider>
      <AppContainer>
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path="/tv-shows" element={<ProtectedRoute><TVShows /></ProtectedRoute>} />
            <Route path="/live-tv" element={<ProtectedRoute><LiveTV /></ProtectedRoute>} />
            <Route path="/player/:type/:id" element={<ProtectedRoute><Player /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </MainContent>
      </AppContainer>
    </AuthProvider>
  );
}

export default App;
