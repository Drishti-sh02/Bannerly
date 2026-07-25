import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
