import Dashboard from "../components/admin/Dashboard";
import Profile from "../components/admin/Profile";
import Login from "../components/frontend/Auth/Login";
import Logout from "../components/frontend/Auth/Logout";
import Register from "../components/frontend/Auth/Register";
import Home from "../components/frontend/Home";
import NotFound from "../components/frontend/NotFound";

const routes = [
  { path: "/dashboard", name: "Admin", element: <Dashboard /> },
  { path: "/profile", name: "Profile", element: <Profile /> },
  { path: "/home", name: "Home", element: <Home /> },
  { path: "/register", name: "Register", element: <Register /> },
  { path: "/login", name: "Login", element: <Login /> },
  { path: "/logout", name: "Logout", element: <Logout /> },
  { path: "*", name: "NotFound", element: <NotFound /> }


];

export default routes;
