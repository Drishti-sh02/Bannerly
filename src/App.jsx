import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import CreateAnnouncement from './pages/CreateAnnouncement';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/create" element={<CreateAnnouncement />} />
      <Route path="/edit/:id" element={<CreateAnnouncement />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/settings" element={<Settings />} />
      {/* Fallback */}
      <Route path="*" element={<div>Welcome to Bannerly. Please install via Shopify.</div>} />
    </Routes>
  );
}

export default App;
