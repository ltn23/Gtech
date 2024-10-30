import React, { useEffect, useState } from "react";
import "./UserManagement.css"; // Custom CSS file
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap"; // Bootstrap library
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
    gender: "male",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      const data =  response.data;
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  };

  const handleShow = (user = {}) => {
    setCurrentUser(
      user.id
        ? user
        : {
            name: "",
            email: "",
            phone: "",
            address: "",
            role: "customer",
            gender: "male",
          }
    ); // Default role and gender set here
    setEditMode(!!user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentUser({
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "customer",
      gender: "male",
    }); // Reset to default role and gender
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `http://localhost:8000/api/users/${currentUser.id}`
      : "http://localhost:8000/api/users";

    try {
      const token = localStorage.getItem('token');
      const response = await axios(url, {
        
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: currentUser,
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      fetchUsers(); // Reload users
      handleClose(); // Close modal
      showToast(editMode ? "User updated successfully!" : "User created successfully!");
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token'); // Lấy token nếu cần thiết
  
        const response = await axios.delete(
          `http://localhost:8000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
            },
          }
        );
  
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
  
        fetchUsers(); // Reload users
        showToast("User deleted successfully!", "success");
      } catch (err) {
        console.error("Error:", err.response?.data || err.message); // Ghi log chi tiết lỗi
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
    <div className="user-management container">
      <h2 className="text-center mb-4">User Management</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Create User
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
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-danger" : "badge-info"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.gender}</td>
                  <td className="action-buttons">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleShow(user)}
                      className="btn-custom"
                    >
                      <FaEdit className="icon" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="btn-custom"
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

      {/* Modal for creating/editing user */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentUser.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={currentUser.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={currentUser.address}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formUserGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={currentUser.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={currentUser.role}
                onChange={handleInputChange}
                required
              >
                <option value="customer">Customer</option>
                {/* <option value="admin">Admin</option> */}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Update User" : "Create User"}
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

export default UserManagement;
