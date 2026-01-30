import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import PropertyDetail from './components/dashboard/PropertyDetail';
import CaseReview from './components/dashboard/CaseReview';
import PropertiesList from './components/properties/PropertiesList';
import MapView from './components/map/MapView';
import Reports from './components/reports/Reports';
import ReportsDashboard from './components/reporting/ReportsDashboard';
import ReportBuilder from './components/reporting/ReportBuilder';
import ReportPreview from './components/reporting/ReportPreview';
import Settings from './components/settings/Settings';
import Login from './components/auth/Login';
import UserProfile from './components/profile/UserProfile';
import RegistrationForm from './components/registration/RegistrationForm';
import RegistrationList from './components/registration/RegistrationList';
import RegistrationStatus from './components/registration/RegistrationStatus';
import RegistrationDetail from './components/registration/RegistrationDetail';
import ViolationCases from './components/enforcement/ViolationCases';
import NoticeGenerator from './components/enforcement/NoticeGenerator';
import PaymentTracking from './components/enforcement/PaymentTracking';
import PaymentDetail from './components/enforcement/PaymentDetail';
import ComplaintsList from './components/complaints/ComplaintsList';
import ComplaintSubmission from './components/complaints/ComplaintSubmission';
import InspectionScheduler from './components/inspections/InspectionScheduler';
import InspectionDetail from './components/inspections/InspectionDetail';
import AppealsList from './components/appeals/AppealsList';
import AppealDetail from './components/appeals/AppealDetail';
import RenewalsList from './components/renewals/RenewalsList';
import NewCaseForm from './components/enforcement/NewCaseForm';
import ComplaintDetail from './components/complaints/ComplaintDetail';
import NCUCList from './components/enforcement/NCUCList';
import ViolationCatalog from './components/enforcement/ViolationCatalog';
import PublicPropertySearch from './components/public/PublicPropertySearch';
import PublicResources from './components/public/PublicResources';
import { RoleContext } from './context/RoleContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(RoleContext);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <RoleContext.Provider value={{ user, isAuthenticated, handleLogin, handleLogout }}>
      <Router>
        {!isAuthenticated ? (
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile user={user} />} />

              {/* Common Routes */}
              <Route path="/properties" element={<PropertiesList />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/map" element={<MapView />} />

              {/* Finance Roles */}
              <Route path="/payments" element={
                <ProtectedRoute allowedRoles={['Finance', 'Admin', 'Enforcement Officer']}>
                  <PaymentTracking />
                </ProtectedRoute>
              } />
              <Route path="/payment/:id" element={
                <ProtectedRoute allowedRoles={['Finance', 'Admin', 'Enforcement Officer']}>
                  <PaymentDetail />
                </ProtectedRoute>
              } />

              {/* Planning Roles */}
              <Route path="/ncuc" element={
                <ProtectedRoute allowedRoles={['Planning', 'Admin', 'Enforcement Officer']}>
                  <NCUCList />
                </ProtectedRoute>
              } />
              <Route path="/registrations" element={
                <ProtectedRoute allowedRoles={['Planning', 'Admin', 'Enforcement Officer']}>
                  <RegistrationList />
                </ProtectedRoute>
              } />
              <Route path="/registration/:id" element={
                <ProtectedRoute allowedRoles={['Planning', 'Admin', 'Enforcement Officer']}>
                  <RegistrationDetail />
                </ProtectedRoute>
              } />

              {/* Legal / Enforcement Roles */}
              <Route path="/violations" element={
                <ProtectedRoute allowedRoles={['Legal', 'Admin', 'Enforcement Officer']}>
                  <ViolationCases />
                </ProtectedRoute>
              } />
              <Route path="/complaints" element={
                <ProtectedRoute allowedRoles={['Legal', 'Admin', 'Enforcement Officer']}>
                  <ComplaintsList />
                </ProtectedRoute>
              } />
              <Route path="/appeals" element={
                <ProtectedRoute allowedRoles={['Legal', 'Admin', 'Enforcement Officer']}>
                  <AppealsList />
                </ProtectedRoute>
              } />
              <Route path="/violation-catalog" element={
                <ProtectedRoute allowedRoles={['Legal', 'Admin', 'Enforcement Officer']}>
                  <ViolationCatalog />
                </ProtectedRoute>
              } />

              {/* Other Routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* Custom Reporting Routes */}
              <Route path="/custom-reports" element={
                <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal']}>
                  <ReportsDashboard />
                </ProtectedRoute>
              } />
              <Route path="/reports/new" element={
                <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal']}>
                  <ReportBuilder />
                </ProtectedRoute>
              } />
              <Route path="/reports/preview" element={
                <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal']}>
                  <ReportPreview />
                </ProtectedRoute>
              } />
              <Route path="/reports/:id/edit" element={
                <ProtectedRoute allowedRoles={['Admin', 'Enforcement Officer', 'Finance', 'Planning', 'Legal']}>
                  <ReportBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/case/new" element={<NewCaseForm />} />
              <Route path="/case/:id" element={<CaseReview />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/registration-status" element={<RegistrationStatus />} />
              <Route path="/notice-generator" element={<NoticeGenerator />} />
              <Route path="/submit-complaint" element={<ComplaintSubmission />} />
              <Route path="/inspections" element={<InspectionScheduler />} />
              <Route path="/inspection/:id" element={<InspectionDetail />} />
              <Route path="/appeal/:id" element={<AppealDetail />} />
              <Route path="/renewals" element={<RenewalsList />} />
              <Route path="/complaint/:id" element={<ComplaintDetail />} />
              <Route path="/public-search" element={<PublicPropertySearch />} />
              <Route path="/public-resources" element={<PublicResources />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </RoleContext.Provider>
  );
}

export default App;
