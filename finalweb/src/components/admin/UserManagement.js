import React, { useEffect, useState } from "react";
import './UserManagement.css'; // Custom CSS file
import { Modal, Button, Form } from 'react-bootstrap'; // Bootstrap library

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', phone: '', address: '', role: 'customer', gender: 'male' }); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (user = {}) => {
    setCurrentUser(user.id ? user : { name: '', email: '', phone: '', address: '', role: 'customer', gender: 'male' }); // Default role and gender set here
    setEditMode(!!user.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentUser({ name: '', email: '', phone: '', address: '', role: 'customer', gender: 'male' }); // Reset to default role and gender
    setEditMode(false);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `http://localhost:8000/api/users/${currentUser.id}` : 'http://localhost:8000/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentUser),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchUsers(); // Reload users
      handleClose(); // Close modal
    } catch (err) {
      setError("Failed to save user.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        fetchUsers(); // Reload users
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  if (loading) return <div className="text-center"><p>Loading...</p></div>;
  if (error) return <div className="text-center"><p className="text-danger">{error}</p></div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Management</h2>
      <Button variant="primary" onClick={() => handleShow()}>Create User</Button>
      <div className="table-responsive">
        <table className="table table-hover mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
              <th>Gender</th> {/* Thêm cột Gender */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`user-row ${user.role === 'admin' ? 'bg-danger text-white' : ''}`}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.gender}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(user)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for creating/editing user */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit User' : 'Create User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUserName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={currentUser.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={currentUser.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formUserPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={currentUser.password} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="formUserPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={currentUser.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formUserAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={currentUser.address} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formUserGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" name="gender" value={currentUser.gender} onChange={handleInputChange} required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Control>
            </Form.Group>
            {/* <Form.Group controlId="formUserRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={currentUser.role} onChange={handleInputChange} required>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group> */}
            <Button variant="primary" type="submit">
              {editMode ? 'Update User' : 'Create User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
