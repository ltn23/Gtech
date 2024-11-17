import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/sales", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { labels, data } = response.data;

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Sales",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-center">Sales Chart</h3>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: true,
                text: "Sales Over Time",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time Period",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Sales Amount",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default SalesChart;
