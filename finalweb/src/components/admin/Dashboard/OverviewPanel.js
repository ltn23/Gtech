import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const StatBox = ({ icon, label, value }) => (
  <Card className="stat-box mb-3">
    <Card.Body className="d-flex align-items-center">
      <div className={`icon me-3 ${icon}`}></div>
      <div>
        <h5>{label}</h5>
        <h3>{value}</h3>
      </div>
    </Card.Body>
  </Card>
);

const OverviewPanel = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div className="row">
      <div className="col-md-3">
        <StatBox icon="cart" label="Total Orders" value={stats.total_orders || 0} />
      </div>
      <div className="col-md-3">
        <StatBox icon="dollar" label="Revenue This Month" value={`$${stats.monthly_revenue || 0}`} />
      </div>
      <div className="col-md-3">
        <StatBox icon="box" label="Products Available" value={stats.products_available || 0} />
      </div>
      <div className="col-md-3">
        <StatBox icon="user" label="Total Customers" value={stats.total_customers || 0} />
      </div>
    </div>
  );
};

export default OverviewPanel;
