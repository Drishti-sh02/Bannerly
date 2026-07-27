import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';

import CreateAnnouncement from './pages/CreateAnnouncement';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Landing from './pages/auth/Landing';
import Login from './pages/auth/Login';
import OAuth from './pages/auth/OAuth';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />
      <Route path="/oauth" element={<OAuth />} />

      {/* Protected Routes (wrapped in app-layout) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/create" element={<CreateAnnouncement />} />
        <Route path="/edit/:id" element={<CreateAnnouncement />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
