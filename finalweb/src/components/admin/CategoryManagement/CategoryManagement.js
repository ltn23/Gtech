import React, { useEffect, useState } from "react";
import "./CategoryManagement.css"; // Custom CSS file
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap"; // Bootstrap library
import { FaEdit, FaTrash } from "react-icons/fa";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/categories");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  };

  const handleShow = (category = {}) => {
    setCurrentCategory(
      category.id
        ? category
        : {
            name: "",
            description: "",
          }
    );
    setEditMode(!!category.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentCategory({
      name: "",
      description: "",
    });
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `http://localhost:8000/api/categories/${currentCategory.id}`
      : "http://localhost:8000/api/categories";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentCategory),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchCategories(); // Reload categories
      handleClose(); // Close modal
      showToast(editMode ? "Category updated successfully!" : "Category created successfully!");
    } catch (err) {
      setError("Failed to save category.");
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/categories/${categoryId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        fetchCategories(); // Reload categories
        showToast("Category deleted successfully!", "success");
      } catch (err) {
        showToast(err.message, "danger");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center">
        <p className="text-danger">{error}</p>
      </div>
    );

  return (
    <div className="category-management container">
      <h2 className="text-center mb-4">Category Management</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Create Category
      </Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="action-buttons">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleShow(category)}
                    >
                      <FaEdit className="icon" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <FaTrash className="icon" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for creating/editing category */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Category" : "Create Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentCategory.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={currentCategory.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Update Category" : "Create Category"}
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

export default CategoryManagement;
