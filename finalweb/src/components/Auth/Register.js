import React, { useState, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.pathname === "/register") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [location]);

  const handleClose = () => {
    setShow(false);
    navigate("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    // console.log();
    if (!(password === passwordConfirmation)) {
      setIsLoading(false);
      setError("Password confirm does not match ...");
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/register",
          {
            name,
            email,
            password,
          }
        );
        console.log(response.data.message);
        // handleClose();
        setIsLoading(false);
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Điều hướng sau khi đăng ký thành công
        }, 5000);
      } catch (error) {
        // console.error("There was an error registering!", error);
        // setError("Registration failed. Please try again.");
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="register-title" style={{color: "black"}}>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>
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
          <Form.Group
            className="mb-3"
            controlId="formBasicPasswordConfirmation"
          >
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="input-field"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="primary-register" disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="sm" /> // Hiển thị spinner khi đang xử lý
            ) : (
              "Register"
            )}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Register;
