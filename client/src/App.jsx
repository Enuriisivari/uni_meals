import { Routes, Route, Navigate } from "react-router-dom";
import DeliveryLogin from "./pages/DeliveryLogin";
import ForgetPassword from "./pages/ForgetPassword";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import DeliveryStaffDashboard from "./pages/DeliveryStaffDashboard";
import Home from "./pages/Home.jsx";
import LoginSelection from "./pages/LoginSelection.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import SignUp from "./pages/SignUp.jsx";
import Canteens from "./pages/Canteens.jsx";
import Profile from "./pages/Profile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import CanteenMenu from "./pages/CanteenMenu.jsx";
import Orders from "./pages/Orders.jsx";
import TrackingOrder from "./pages/TrackingOrder.jsx";
import { HomePage } from "./pages/HomePage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StaffPortalPage } from "./pages/StaffPortalPage";
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canteens" element={<Canteens />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login-selection" element={<LoginSelection />} />
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/canteen-menu" element={<CanteenMenu />} />
      <Route path="/tracking-order" element={<TrackingOrder />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/forget-password" element={<ForgetPassword />} />
      <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="/admin/delivery-staff" element={<DeliveryStaffDashboard />} />
      <Route path="/dashbord" element={<HomePage />} />
      <Route path="/student" element={<StudentDashboardPage />} />
      <Route path="/staff" element={<StaffPortalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />

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

      {/* Public Routes */}
      <Route path="/customer-feedback" element={<FeedbackForm />} />

    </Routes>
  );
}

export default App;