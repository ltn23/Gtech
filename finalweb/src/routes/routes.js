import Dashboard from "../components/admin/Dashboard";
import Profile from "../components/admin/Profile";
import Login from "../components/frontend/Auth/Login";
import Register from "../components/frontend/Auth/Register";
import Home from "../components/frontend/Home";

const routes = [
  { path: "/dashboard", name: "Admin", element: <Dashboard /> },
  { path: "/profile", name: "Profile", element: <Profile /> },
  { path: "/home", name: "Home", element: <Home /> },
  { path: "/register", name: "Register", element: <Register /> },
  { path: "/login", name: "Login", element: <Login /> },


];

export default routes;
