import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    id: null,
    name: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    category_id: "",
    image: null,
    status: "available",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedProducts = response.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedProducts);
    } catch (err) {
      setError(
        "Failed to fetch products. Please check your network or login again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      setError(
        "Failed to fetch categories. Please check your network or login again."
      );
    }
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(
      () => setToast({ show: false, message: "", variant: "success" }),
      3000
    );
  }, []);

  const handleShow = (product = {}) => {
    setCurrentProduct(
      product.id
        ? { ...product, image: null }
        : {
            id: null,
            name: "",
            description: "",
            price: 0,
            stock_quantity: 0,
            category_id: "",
            image: null,
            status: "available",
          }
    );
    setEditMode(!!product.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentProduct({
      id: null,
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: "",
      image: null,
      status: "available",
    });
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setCurrentProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gtechnology");

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dsh0cqmhc/image/upload",
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload image");
    }

    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentProduct.price < 0) {
      showToast("Price cannot be negative.", "danger");
      return;
    }
    if (currentProduct.stock_quantity < 0) {
      showToast("Stock quantity cannot be negative.", "danger");
      return;
    }

    const productData = {
      ...currentProduct,
      image_url: currentProduct.image
        ? await uploadImageToCloudinary(currentProduct.image)
        : currentProduct.image_url,
    };

    if (editMode) {
      productData.id = currentProduct.id;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (![200, 201].includes(response.status)) {
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
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:8000/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        fetchProducts();
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete product.", "danger");
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
      <ProductTable
        products={products}
        handleShow={handleShow}
        handleDelete={handleDelete}
      />
      <ProductModal
        show={showModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        currentProduct={currentProduct}
        categories={categories}
        editMode={editMode}
      />
      <ToastContainer position="top-center">
        <Toast
          onClose={() => setToast({ show: false })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Body className={`bg-${toast.variant}`}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

const ProductTable = ({ products, handleShow, handleDelete }) => (
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
);

const ProductModal = ({
  show,
  handleClose,
  handleSubmit,
  handleInputChange,
  handleImageChange,
  currentProduct,
  categories,
  editMode,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title style={{ color: "black" }}>
        {editMode ? "Edit Product" : "Create Product"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formProductImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!editMode}
          />
        </Form.Group>
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
            as="textarea"
            name="description"
            value={currentProduct.description}
            onChange={handleInputChange}
            required
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
            min="0"
          />
        </Form.Group>
        <Form.Group controlId="formProductStock">
          <Form.Label>Stock Quantity</Form.Label>
          <Form.Control
            type="number"
            name="stock_quantity"
            value={currentProduct.stock_quantity}
            onChange={handleInputChange}
            required
            min="0"
          />
        </Form.Group>
        <Form.Group controlId="formProductCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category_id"
            value={currentProduct.category_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formProductStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={currentProduct.status}
            onChange={handleInputChange}
          >
            <option value="available">Available</option>
            <option value="unavailable">Out of Stock</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {editMode ? "Update Product" : "Create Product"}
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
);

export default ProductManagement;
