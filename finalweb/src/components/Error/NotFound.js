import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; 
import { Container, Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <Container
      fluid
      className="not-found-container d-flex flex-column justify-content-center align-items-center bg-light"
      style={{ height: "100vh" }}
    >
      <h1 className="display-1 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-muted mb-4">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/home">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </Container>
  );
};

export default NotFound;