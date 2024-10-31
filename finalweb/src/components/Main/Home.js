import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'; // Create a CSS file for styles

function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard");
      }
    }, 1000);

    return () => clearTimeout(timeout); 
  }, [navigate]);

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <h1 className="welcome-title">Welcome to Our Application!</h1>
          <p className="welcome-message">Your one-stop solution for managing your products and categories.</p>
          <div className="features">
            <div className="feature-card">
              <h3>Product Management</h3>
              <p>Effortlessly add, edit, and delete products.</p>
            </div>
            <div className="feature-card">
              <h3>Category Management</h3>
              <p>Organize products into categories for easier navigation.</p>
            </div>
            <div className="feature-card">
              <h3>User Profiles</h3>
              <p>Manage user accounts and roles with ease.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
