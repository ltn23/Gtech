import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Card } from "react-bootstrap";
import axios from "axios";

const ProductPerformance = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/product/top", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch top-performing products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return (
      <div className="text-center">
        <Alert variant="danger">{error}</Alert>
      </div>
    );

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Header className="bg-primary text-white text-center">
        <h3>Top Performing Products</h3>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.units_sold}</td>
                <td>${product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductPerformance;
