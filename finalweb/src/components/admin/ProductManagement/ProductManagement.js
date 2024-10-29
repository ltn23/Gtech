import React, { useEffect, useState } from "react";
import "./ProductManagement.css";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "", // Default to empty
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories on component mount
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/categories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data); // Set the categories from the response
    } catch (err) {
      setError("Failed to fetch categories.");
    }
  };

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(
      () => setToast({ show: false, message: "", variant: "success" }),
      3000
    );
  };

  const handleShow = (product = {}) => {
    setCurrentProduct(
      product.id
        ? product
        : { name: "", description: "", price: 0, stock: 0, category: "" }
    );
    setEditMode(!!product.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    });
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `http://localhost:8000/api/products/${currentProduct.id}`
      : "http://localhost:8000/api/products";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProduct),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchProducts();
      handleClose();
      showToast(
        editMode
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (err) {
      setError("Failed to save product.");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        fetchProducts();
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        showToast(err.message, "danger");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  if (error)
    return (
      <div className="text-center">
        <p className="text-danger">{error}</p>
      </div>
    );

  return (
    <div className="product-management container">
      <h2 className="text-center mb-4">Product Management</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Create Product
      </Button>
      <div className="table-responsive">
        <table className="table table-bordered table-hover mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.category.name}</td>
                <td>{product.status}</td>
                <td className="action-buttons">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => handleShow(product)}
                  >
                    <FaEdit className="icon" /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash className="icon" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Product" : "Create Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProductName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentProduct.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentProduct.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formProductPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentProduct.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProductStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={currentProduct.stock}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={currentProduct.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Update Product" : "Create Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant} autohide delay={3000}>
          <Toast.Header closeButton>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ProductManagement;
