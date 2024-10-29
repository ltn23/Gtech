import { Navigate } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard";
import Login from "../components/Auth/Login";
import Logout from "../components/Auth/Logout";
import Register from "../components/Auth/Register";
import Home from "../components/Main/Home";
import NotFound from "../components/Error/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import ProductsList from "../components/Product/ProductsList";
import Profile from "../components/Profile/ProfileDialog";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import UserManagement from "../components/admin/UserManagement";

const routes = [
  { path: "/dashboard", name: "Admin", element: <ProtectedRoute element={<Dashboard />} roleRequired="admin" /> },
  { path: "/profile", name: "Profile", element: <Profile /> },
  { path: "/home", name: "Home", element: <Home /> },
  { path: "/register", name: "Register", element: <Register /> },
  { path: "/login", name: "Login", element: localStorage.getItem("isLoggedIn") === "true" ? <Navigate to="/home" /> : <Login /> },
  { path: "/logout", name: "Logout", element: <Logout /> },
  { path: "/products", name: "Products", element: <ProductsList /> },
  { path: "/shopping-cart", name: "Shopping Cart", element: <ShoppingCart /> },
  { path: "/user-management", name: "User Management", element: <UserManagement /> },
  { path: "*", name: "NotFound", element: <NotFound /> }


];

export default routes;
