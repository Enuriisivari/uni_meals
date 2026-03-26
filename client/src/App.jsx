import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryManagement from './pages/DeliveryManagement';
import StaffManagement from './pages/StaffManagement';
import TokenAssignment from './pages/TokenAssignment';
import StaffIDAssignment from './pages/StaffIDAssignment';
import OrderManagement from './pages/OrderManagement';
import DeliveryTracking from './pages/DeliveryTracking';
import DiscountManagement from './pages/DiscountManagement';
import BudgetManagement from './pages/BudgetManagement';
import NotificationManagement from './pages/NotificationManagement';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import FeedbackManagement from './pages/FeedbackManagement';

// Styles
import './styles/admin.css';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Panel Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="tokens" element={<TokenAssignment />} />
          <Route path="staff-id" element={<StaffIDAssignment />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="tracking" element={<DeliveryTracking />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="budgets" element={<BudgetManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="feedback" element={<FeedbackManagement />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;