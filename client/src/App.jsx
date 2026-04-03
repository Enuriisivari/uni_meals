import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminFeedback from './pages/AdminFeedback';
import Analytics from './pages/Analytics';
import BudgetManagement from './pages/BudgetManagement';
import DeliveryManagement from './pages/DeliveryManagement';
import NotificationManagement from './pages/NotificationManagement';
import OrderManagement from './pages/OrderManagement';
import StaffIDAssignment from './pages/StaffIDAssignment';
import StaffManagement from './pages/StaffManagement';
import TokenAssignment from './pages/TokenAssignment';
import DiscountManagement from './pages/DiscountManagement';
import DeliveryTracking from './pages/DeliveryTracking';

// UI Components (Added as routes for direct access)
import StaffTable from './components/StaffTable';
import StaffForm from './components/StaffForm';
import OrderTable from './components/OrderTable';
import DeliveryForm from './components/DeliveryForm';
import DeliveryTable from './components/DeliveryTable';
import FeedbackForm from './components/Feedback/FeedbackForm';
import FeedbackManagement from './components/Admin/FeedbackManagement';

// Styles
import './App.css';
import './styles/admin.css';
import './styles/feedback.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="budgets" element={<BudgetManagement />} />
          <Route path="delivery" element={<DeliveryManagement />} />
          <Route path="tracking" element={<DeliveryTracking />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="staff-id" element={<StaffIDAssignment />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="tokens" element={<TokenAssignment />} />
          <Route path="feedback-management" element={<FeedbackManagement />} />
          
          {/* UI Component Routes for direct preview */}
          <Route path="ui/staff-table" element={<StaffTable data={[]} />} />
          <Route path="ui/delivery-table" element={<DeliveryTable data={[]} />} />
          <Route path="ui/staff-form" element={<StaffForm />} />
          <Route path="ui/order-table" element={<OrderTable data={[]} />} />
          <Route path="ui/delivery-form" element={<DeliveryForm />} />
          <Route path="ui/feedback-form" element={<FeedbackForm />} />
          
        </Route>

        {/* Default redirect or Home page if needed */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Public Routes */}
        <Route path="/customer-feedback" element={<FeedbackForm />} />
      </Routes>
    </Router>
  );
}

export default App;
