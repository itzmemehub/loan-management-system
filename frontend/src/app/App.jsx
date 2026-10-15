import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ScrollManager from "./ScrollManager";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/Home/HomePage";
import ApplyPage from "../pages/Apply/ApplyPage";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import LoanDetailsPage from "../pages/LoanDetails/LoanDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/apply-loan" element={<Navigate to="/apply" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/loan/:id" element={<ProtectedRoute><LoanDetailsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
