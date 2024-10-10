import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function Register() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.pathname === "/register") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [location]);

  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log();
    if (!(password === passwordConfirmation)) {
      setError("Password confirm does not match ...");
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
        handleClose();
      } catch (error) {
        console.error("There was an error registering!", error);
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
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
