import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    console.log("All localStorage data has been removed");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  }, [navigate]);

  return <div></div>;
}

export default Logout;
