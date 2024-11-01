import React, { useEffect, useState, useCallback } from "react";
import "./CategoryManagement.css";
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      setError("Failed to fetch categories. Please check your network or login again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  }, []);

  const handleShow = (category = {}) => {
    setCurrentCategory(category.id ? category : { name: "", description: "" });
    setEditMode(!!category.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentCategory({ name: "", description: "" });
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "put" : "post";
    const url = editMode
      ? `http://localhost:8000/api/categories/${currentCategory.id}`
      : "http://localhost:8000/api/categories";

    try {
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: currentCategory,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error("Network response was not ok");
      }

      fetchCategories();
      handleClose();
      showToast(editMode ? "Category updated successfully!" : "Category created successfully!");
    } catch (err) {
      showToast("Failed to save category. Please try again.", "danger");
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        
        fetchCategories();
        showToast("Category deleted successfully!", "success");
      } catch (err) {
        showToast("Failed to delete category.", "danger");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="category-management container">
      <h2 className="text-center mb-4">Category Management</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Create Category
      </Button>
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}
      <CategoryTable 
        categories={categories} 
        handleShow={handleShow} 
        handleDelete={handleDelete} 
      />
      <CategoryModal
        show={showModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        currentCategory={currentCategory}
        editMode={editMode}
      />
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

const CategoryTable = ({ categories, handleShow, handleDelete }) => (
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
              <Button variant="outline-warning" size="sm" onClick={() => handleShow(category)}>
                <FaEdit className="icon" /> Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category.id)}>
                <FaTrash className="icon" /> Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CategoryModal = ({ show, handleClose, handleSubmit, handleInputChange, currentCategory, editMode }) => (
  <Modal show={show} onHide={handleClose}>
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
);

export default CategoryManagement;
