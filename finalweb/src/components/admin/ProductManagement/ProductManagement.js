import React, { useEffect, useState } from "react";
import "./ProductManagement.css";
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  
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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setCategories(response.data);
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

  const handleShow = (product = {}) => {
    setCurrentProduct(
      product.id
        ? { ...product, image: null }
        : { id: null, name: "", description: "", price: 0, stock_quantity: 0, category_id: "", image: null, status: "available" }
    );
    setEditMode(!!product.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentProduct({ id: null, name: "", description: "", price: 0, stock_quantity: 0, category_id: "", image: null, status: "available" });
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

    const response = await axios.post("https://api.cloudinary.com/v1_1/dsh0cqmhc/image/upload", formData);
    
    if (response.status !== 200) {
      throw new Error("Failed to upload image");
    }
    
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare the product data to send to the backend
    const productData = {
        ...currentProduct,
        image_url: currentProduct.image ? await uploadImageToCloudinary(currentProduct.image) : currentProduct.image_url, // Upload the image if new
    };

    // Add the ID only if we are in edit mode (updating)
    if (editMode) {
        productData.id = currentProduct.id;
    }

    try {
        // Perform the API request to save the product
        const response = await axios.post(`http://localhost:8000/api/products`, productData, {
            headers: {
                
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }

        // Refresh the product list and close the modal
        fetchProducts();
        handleClose();
        showToast(editMode ? "Product updated successfully!" : "Product created successfully!");

    } catch (err) {
        setError("Failed to save product."); // Set error state if there's a problem
        console.error("Error:", err); // Log error for debugging
    }
};


  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.delete(`http://localhost:8000/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Thêm token vào headers
        });
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        fetchProducts(); // Tải lại danh sách sản phẩm
        showToast("Product deleted successfully!", "success");
      } catch (err) {
        showToast(err.message || "Failed to delete product.", "danger");
      }
    }
  };
  
  

  if (loading) return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <div className="text-center"><p className="text-danger">{error}</p></div>;

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
                  <img src={product.image_url} alt={product.name} style={{ width: '100px', height: 'auto' }} />
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.category.name}</td>
                <td>{product.status}</td>
                <td className="action-buttons">
                  <Button variant="outline-warning" size="sm" onClick={() => handleShow(product)}>
                    <FaEdit className="icon" /> Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.id)}>
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
          <Modal.Title>{editMode ? "Edit Product" : "Create Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formProductImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editMode} // Bắt buộc chọn hình ảnh khi tạo mới
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
                <option value="unavailable">Unavailable</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Update Product" : "Create Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-center">
        <Toast onClose={() => setToast({ show: false })} show={toast.show} delay={3000} autohide>
          <Toast.Body className={`bg-${toast.variant}`}>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ProductManagement;
