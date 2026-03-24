import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import SignUp from './pages/SignUp.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/canteens"
          element={
            <PlaceholderPage
              title="Canteens"
              description="Browse all campus canteens, hours, and menus—this page is ready for your list and filters."
            />
          }
        />
        <Route
          path="/orders"
          element={
            <PlaceholderPage
              title="Orders"
              description="Track active orders and order history here once you connect the backend."
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PlaceholderPage
              title="Profile"
              description="Account settings, meal plan, and preferences will live here."
            />
          }
        />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}
