import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "./Login.css";
import { SiGoogle } from "react-icons/si";

function Login() {
  const navigate = useNavigate();
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

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const role = queryParams.get("role");
    const error = queryParams.get("error");

    if (error) {
      setErrorMessage(error);
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", role);

      // Điều hướng tới trang home sau khi đăng nhập thành công
      navigate("/home");
    }
  }, [location, navigate]);

  const handleClose = () => {
    setShow(false);
    navigate("/home");
  };

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
        setErrorMessage(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("There was an error logging in. Please try again.");
      console.error("There was an error logging in!", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="login-modal">
      <Modal.Header closeButton>
        <Modal.Title
          style={{ color: "black", fontSize: "26px", fontWeight: "bold" }}
        >
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          <div className="mt-3">
            <button
              type="button"
              className="google-login-button"
              onClick={handleGoogleLogin}
            >
              <SiGoogle className="google-icon" /> Sign in with Google
            </button>
          </div>
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
        <Button
          variant="outline-danger"
          onClick={handleClose}
          className="outline-danger"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
