import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetails.css"; // Thêm CSS tùy chỉnh nếu cần

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProduct(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/cart",
        { product_id: productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`Product has been added to your cart!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
    <div className="product-details-container">
      <ToastContainer />
      <Link to="/products" className="continue-shopping">
        <i className="fas fa-long-arrow-alt-left me-2"></i>
        Continue shopping
      </Link>
      {product && (
        <div className="product-details">
          <h2 className="product-name">{product.name}</h2>
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image"
          />
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: ${product.price}</p>
          <button onClick={handleAddToCart} className="add-to-cart">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
