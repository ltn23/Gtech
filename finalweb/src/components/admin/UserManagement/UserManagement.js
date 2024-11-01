import React, { useEffect, useState, useCallback } from "react";
import "./UserManagement.css";
import { Modal, Button, Form, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
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

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please check your network or login again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  }, []);

  const handleShow = (user = {}) => {
    setCurrentUser(
      user.id
        ? user
        : { name: "", email: "", phone: "", address: "", role: "customer", gender: "male" }
    );
    setEditMode(!!user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentUser({ name: "", email: "", phone: "", address: "", role: "customer", gender: "male" });
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? "put" : "post";
    const url = editMode
      ? `http://localhost:8000/api/users/${currentUser.id}`
      : "http://localhost:8000/api/users";

    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: currentUser,
      });

      if (![200, 201].includes(response.status)) {
        throw new Error("Network response was not ok");
      }

      fetchUsers();
      handleClose();
      showToast(editMode ? "User updated successfully!" : "User created successfully!");
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        fetchUsers();
        showToast("User deleted successfully!", "success");
      } catch (err) {
        showToast("Failed to delete user.", "danger");
      }
    }
  };

  if (loading) return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <div className="text-center"><p className="text-danger">{error}</p></div>;

  return (
    <div className="user-management container">
      <h2 className="text-center mb-4">User Management</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShow()}>
        + Create User
      </Button>
      <UserTable users={users} handleShow={handleShow} handleDelete={handleDelete} />
      <UserModal
        show={showModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        currentUser={currentUser}
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

const UserTable = ({ users, handleShow, handleDelete }) => (
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
              <span className={`badge ${user.role === "admin" ? "badge-danger" : "badge-info"}`}>
                {user.role}
              </span>
            </td>
            <td>{user.gender}</td>
            <td className="action-buttons">
              <Button variant="outline-warning" size="sm" onClick={() => handleShow(user)}>
                <FaEdit className="icon" /> Edit
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                <FaTrash className="icon" /> Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UserModal = ({ show, handleClose, handleSubmit, handleInputChange, currentUser, editMode }) => (
  <Modal show={show} onHide={handleClose}>
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
        {!editMode && (
          <Form.Group controlId="formUserPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={currentUser.password || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        )}
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
);

export default UserManagement;
