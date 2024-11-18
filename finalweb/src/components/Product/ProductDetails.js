import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Spinner, Badge, Form, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

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
      }
    };

    const fetchProductReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/reviews/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews(response.data);
      } catch (err) {
        toast.error("Failed to load reviews", { position: "top-right" });
      }
    };

    fetchProductDetails();
    fetchProductReviews();
    setLoading(false);
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting review with data:", {
      product_id: productId,
      rating: newReview.rating,
      comment: newReview.comment,
  });

    try {
      const response = await axios.post(
        "http://localhost:8000/api/reviews",
        {
          product_id: productId,
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReviews([...reviews, response.data]); // Add new review to the list
      setNewReview({ rating: 0, comment: "" }); // Reset form
      toast.success("Review submitted successfully!", {
        position: "top-right",
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review.", { position: "top-right" });
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

          {/* Feedback and Reviews Section */}
          <div className="reviews-section mt-5">
            <h4>Customer Reviews</h4>
            <hr />
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <strong>{review.user.name}</strong> 
                  <span className="text-warning ms-2">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </span>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            <div className="add-review mt-4">
              <h5>Leave a Review</h5>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: e.target.value })
                    }
                  >
                    <option value="0">Select Rating</option>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} Star{value > 1 && "s"}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="comment" className="mt-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your feedback here..."
                  />
                </Form.Group>
                <Button className="mt-3" variant="success" type="submit">
                  Submit Review
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
