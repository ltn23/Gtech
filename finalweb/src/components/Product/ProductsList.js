import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductsList.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const categoryId = query.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products${
            categoryId ? `?category=${categoryId}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sortedProducts = response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at); // Hoặc sử dụng trường khác nếu cần
        });
        setProducts(sortedProducts);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error.message}</p>;

  return (
    <div className="products-container">
      <ToastContainer />
      <div className="products-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
