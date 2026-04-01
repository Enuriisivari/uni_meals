import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { StudentDashboardPage } from "./pages/StudentDashboardPage";
import { StaffPortalPage } from "./pages/StaffPortalPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/student" element={<StudentDashboardPage />} />
      <Route path="/staff" element={<StaffPortalPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
