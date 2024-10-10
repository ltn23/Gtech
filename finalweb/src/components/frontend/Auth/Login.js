import React, { useEffect, useState } from "react";
import Navbar from "../../../layouts/frontend/Navbar";
import { useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function Login() {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (location.pathname === "/login") {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [location]);

  const handleClose = () => setShow(false);

  const Login = async () => {
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
      if(response.status === 200){
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", response.data.role);

        console.log(response.data.messsage);
        window.location.href = "home"
      }
      else{
        console.error(response.data.message);
      }
      // Lưu token vào localStorage hoặc state

    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
          <Button variant="primary" onClick={Login}>
            Login
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

export default Login;
