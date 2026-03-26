import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canteens" element={<Canteens />} />
        <Route
          path="/orders"
          element={<Orders />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/canteen-menu" element={<CanteenMenu />} />
        <Route path="/tracking-order" element={<TrackingOrder />} />
      </Routes>
    </BrowserRouter>
  )
}
