import { Navigate } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard";
import Profile from "../components/Profile/Profile";
import Login from "../components/Auth/Login";
import Logout from "../components/Auth/Logout";
import Register from "../components/Auth/Register";
import Home from "../components/Main/Home";
import NotFound from "../components/Error/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import ProductsList from "../components/Product/ProductsList";

const routes = [
  { path: "/dashboard", name: "Admin", element: <ProtectedRoute element={<Dashboard />} roleRequired="admin" /> },
  { path: "/profile", name: "Profile", element: <ProtectedRoute element={<Profile />} roleRequired="user" /> },
  { path: "/home", name: "Home", element: <Home /> },
  { path: "/register", name: "Register", element: <Register /> },
  { path: "/login", name: "Login", element: localStorage.getItem("isLoggedIn") === "true" ? <Navigate to="/home" /> : <Login /> },
  { path: "/logout", name: "Logout", element: <Logout /> },
  { path: "/products", name: "Products", element: <ProductsList /> },
  { path: "*", name: "NotFound", element: <NotFound /> }


];

export default routes;
