import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ApplyLoan from "./pages/ApplyLoan";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LoanDetails from "./pages/LoanDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<ApplyLoan />} />
        <Route path="/apply-loan" element={<ApplyLoan />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/loan/:id" element={<ProtectedRoute><LoanDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
