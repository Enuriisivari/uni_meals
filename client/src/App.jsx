import { Routes, Route, Navigate } from 'react-router-dom'
import DeliveryLogin from './pages/DeliveryLogin'
import ForgetPassword from './pages/ForgetPassword'
import DeliveryDashboard from './pages/DeliveryDashboard'
import DeliveryStaffDashboard from './pages/DeliveryStaffDashboard'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/delivery/login" />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/forget-password" element={<ForgetPassword />} />
      <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
      <Route path="/admin/delivery-staff" element={<DeliveryStaffDashboard />} />
    </Routes>
  )
}

export default App
