import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PlatformGateway from './pages/PlatformGateway';
import DesignSystemDemo from './pages/DesignSystemDemo';
import InteractiveDashboard from './pages/InteractiveDashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Settings from './pages/Settings';
import InstituteLayout from './layouts/InstituteLayout';

/**
 * App Component
 * 
 * Main React application entry point.
 * Routes:
 * - /platform - Institutional Platform Gateway (login page)
 * - /demo-design - Design System Demo (visual showcase)
 * - /dashboard - Interactive Institute Dashboard (post-login)
 * - /students - Student Management (post-login)
 * - /attendance - Attendance Management (post-login)
 * - /results - Results Management (post-login)
 * - /settings - System Settings (post-login)
 * - / - Redirects to /platform
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/platform" element={<PlatformGateway />} />
          <Route path="/demo-design" element={<DesignSystemDemo />} />
          <Route
            path="/dashboard"
            element={
              <InstituteLayout>
                <div className="nx-container-fluid">
                  <InteractiveDashboard />
                </div>
              </InstituteLayout>
            }
          />
          <Route
            path="/students"
            element={
              <InstituteLayout>
                <div className="nx-container-fluid">
                  <Students />
                </div>
              </InstituteLayout>
            }
          />
          <Route
            path="/attendance"
            element={
              <InstituteLayout>
                <div className="nx-container-fluid">
                  <Attendance />
                </div>
              </InstituteLayout>
            }
          />
          <Route
            path="/results"
            element={
              <InstituteLayout>
                <div className="nx-container-fluid">
                  <Results />
                </div>
              </InstituteLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <InstituteLayout>
                <div className="nx-container-fluid">
                  <Settings />
                </div>
              </InstituteLayout>
            }
          />
          <Route path="/" element={<Navigate to="/platform" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
