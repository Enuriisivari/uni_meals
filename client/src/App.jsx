import { Routes, Route, Navigate } from 'react-router-dom'
import DeliveryLogin from './pages/DeliveryLogin'
import ForgetPassword from './pages/ForgetPassword'
import DeliveryDashboard from './pages/DeliveryDashboard'
import DeliveryStaffDashboard from './pages/DeliveryStaffDashboard'
import Home from './pages/Home.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import SignUp from './pages/SignUp.jsx'
import Canteens from './pages/Canteens.jsx'
import Profile from './pages/Profile.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import EditProfile from './pages/EditProfile.jsx'
import CanteenMenu from './pages/CanteenMenu.jsx'
import Orders from './pages/Orders.jsx'
import TrackingOrder from './pages/TrackingOrder.jsx'
import { HomePage } from "./pages/HomePage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StaffPortalPage } from "./pages/StaffPortalPage";
import './App.css'


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route path="/orders" element={<Orders />} />
        <Route path='/profile' element={<Profile />} />
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
      </Routes>

  )
}

export default App
