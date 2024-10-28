import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard");
      }
    }, 1000);
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center bg-light"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {!loading && (
            <div className="home-content">
              <h1>Welcome to the Home Page</h1>
              <p>This is the homepage for regular users.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
