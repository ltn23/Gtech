import { Navigate } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import Login from "../components/Auth/Login";
import Logout from "../components/Auth/Logout";
import Register from "../components/Auth/Register";
import Home from "../components/Main/Home";
import NotFound from "../components/Error/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import ProductsList from "../components/Product/ProductsList";
import Profile from "../components/Profile/ProfileDialog";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import UserManagement from "../components/admin/UserManagement/UserManagement";
import ProductManagement from "../components/admin/ProductManagement/ProductManagement";
import CategoryManagement from "../components/admin/CategoryManagement/CategoryManagement";
import UploadImage from "../components/Cloudinary/UploadImage";
import ProductDetails from "../components/Product/ProductDetails";
import Checkout from "../components/Checkout/Checkout";
import OrderManagement from "../components/admin/OrderManagement/OrderManagement";
import MyOrders from "../components/MyOrder/MyOrders";
import SearchResults from "../components/Search/SearchResults";
import Chatbot from "../components/Chatbot/Chatbot";

const routes = [
  
  { path: "/profile", name: "Profile", element: <Profile /> },
  { path: "/home", name: "Home", element: <Home /> },
  { path: "/register", name: "Register", element: <Register /> },
  { path: "/login", name: "Login", element: localStorage.getItem("isLoggedIn") === "true" ? <Navigate to="/home" /> : <Login /> },
  { path: "/logout", name: "Logout", element: <Logout /> },
  { path: "/products", name: "Products", element: <ProtectedRoute element={<ProductsList />} roleRequired="customer" /> },
  { path: "/products/:productId", name: "Products Details", element: <ProtectedRoute element={<ProductDetails />} roleRequired="customer" /> },
  { path: "/shopping-cart", name: "Shopping Cart", element: <ProtectedRoute element={<ShoppingCart />} roleRequired="customer" /> },
  { path: "/checkout", name: "Checkout", element: <ProtectedRoute element={<Checkout />} roleRequired="customer"  /> },
  { path: "/my-orders", name: "My Orders", element: <ProtectedRoute element={<MyOrders />} roleRequired="customer" />},
  { path: "/search", name: "Search", element: <ProtectedRoute element={<SearchResults />} roleRequired="customer" />},

  //chatbot
  { path: "/chatbot", name: "Chat Bot", element: <Chatbot/>},
  //admin
  { path: "/dashboard", name: "Admin", element: <ProtectedRoute element={<Dashboard />} roleRequired="admin" /> },
  { path: "/user-management", name: "User Management", element: <ProtectedRoute element={<UserManagement />} roleRequired="admin" /> },
  { path: "/product-management", name: "Product Management", element: <ProtectedRoute element={<ProductManagement />} roleRequired="admin" /> },
  { path: "/category-management", name: "Category Management", element: <ProtectedRoute element={<CategoryManagement />} roleRequired="admin" /> },
  { path: "/uploadimage", name: "Upload Imgae", element: <ProtectedRoute element={<UploadImage />} roleRequired="admin" /> },
  { path: "/order-management", name: "Order Management", element: <ProtectedRoute element={<OrderManagement />} roleRequired="admin" /> },
  { path: "*", name: "NotFound", element: <NotFound /> }


];

export default routes;
