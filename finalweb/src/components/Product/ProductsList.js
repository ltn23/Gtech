import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Thêm import cho Toastify
import 'react-toastify/dist/ReactToastify.css'; // Thêm CSS cho Toastify
import "./ProductsList.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const categoryId = query.get("category"); // Get the category ID from the URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products${
            categoryId ? `?category=${categoryId}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Token-based authentication
            },
          }
        );
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]); // Depend on categoryId to refetch when it changes

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/cart",
        { product_id: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`Product has been added to your cart!`, {
        position: "top-right", // Vị trí hiển thị thông báo
        autoClose: 3000, // Thời gian tự động đóng
        hideProgressBar: false, // Hiện thanh tiến độ
        closeOnClick: true, // Đóng khi click
        pauseOnHover: true, // Dừng lại khi hover
        draggable: true, // Cho phép kéo
        progress: undefined, // Không hiển thị tiến độ
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="products-container">
     <ToastContainer />
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">Price: ${product.price}</p>
              <button
                onClick={() => handleAddToCart(product.id)} // Chỉ truyền product.id
                className="add-to-cart"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
