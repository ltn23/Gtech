import React, { useEffect, useState } from "react";
import Navbar from "../../../layouts/frontend/Navbar";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import './Login.css';

function Login() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (location.pathname === "/login") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [location]);

  const handleClose = () => setShow(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", response.data.role);

        console.log(response.data.message);
        window.location.href = "home";
      } else {
        // Hiển thị lỗi từ server
        setErrorMessage(response.data.message || "Invalid credentials");
        // alert(response.data.message);
        // console.error(response.data.message);
      }
    } catch (error) {
      setErrorMessage("There was an error logging in. Please try again.");
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email ID</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose} className="outline-danger">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
