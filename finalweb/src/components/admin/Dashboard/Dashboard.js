import React from "react";
import OverviewPanel from "./OverviewPanel";
import SalesChart from "./SalesChart";
import ProductPerformance from "./ProductPerformance";

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      <OverviewPanel />
      <div className="row mt-4">
        <div className="col-md-6">
          <SalesChart />
        </div>
        <div className="col-md-6">
          <ProductPerformance />
        </div>
      </div>
    
    </div>
  );
};

export default Dashboard;
