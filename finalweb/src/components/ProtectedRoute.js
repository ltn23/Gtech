import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, roleRequired }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default ProtectedRoute;
