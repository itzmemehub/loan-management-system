import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

// Pages only the signed-in admin can open.
function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default ProtectedRoute;
