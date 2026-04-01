import { Routes, Route, Navigate } from 'react-router-dom'
import DeliveryLogin from './pages/DeliveryLogin'
import ForgetPassword from './pages/ForgetPassword'
import DeliveryDashboard from './pages/DeliveryDashboard'
import DeliveryStaffDashboard from './pages/DeliveryStaffDashboard'
import { HomePage } from "./pages/HomePage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StaffPortalPage } from "./pages/StaffPortalPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student" element={<StudentDashboardPage />} />
      <Route path="/staff" element={<StaffPortalPage />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/forget-password" element={<ForgetPassword />} />
      <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="/admin/delivery-staff" element={<DeliveryStaffDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
