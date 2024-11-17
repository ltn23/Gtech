import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Spinner, Badge } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetails.css";

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
      toast.success("Product added to cart!", { position: "top-right" });
    } catch (err) {
      toast.error("Failed to add product to cart.", { position: "top-right" });
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p className="text-danger">Error: {error.message}</p>;

  return (
    <div className="product-details-container">
      <ToastContainer />
      <Link to="/products" className="continue-shopping">
        <i className="fas fa-arrow-left me-2"></i> Continue Shopping
      </Link>
      {product && (
        <div className="product-details">
          <div className="row">
            {/* Product Image Section */}
            <div className="col-md-6">
              <div className="main-image">
                <img src={product.image_url} alt={product.name} />
              </div>
              <div className="thumbnail-images">
                {product.images &&
                  product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="thumbnail"
                    />
                  ))}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="col-md-6">
              <h2 className="product-name">{product.name}</h2>
              <div className="d-flex align-items-center mb-2">
                <span className="me-2">
                  <Badge bg="success">In Stock</Badge>
                </span>
                <span className="text-warning">
                  {product.rating} <i className="fas fa-star"></i>
                </span>
                <span className="ms-2">({product.reviews_count} reviews)</span>
              </div>
              <p className="product-description">{product.description}</p>
              <h4 className="product-price">${product.price}</h4>

              <div className="actions mt-4">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary me-3"
                >
                  <i className="fas fa-cart-plus"></i> Add to Cart
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
