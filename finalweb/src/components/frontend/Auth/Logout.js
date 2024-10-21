import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.clear();
    console.log("All localStorage data has been removed");
    window.location.href = "/home";
    // window.location.href = "/login";
  });

  return <div></div>;
}

export default Logout;
