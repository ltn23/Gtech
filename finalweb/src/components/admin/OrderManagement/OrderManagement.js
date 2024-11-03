import React, { useEffect, useState, useCallback } from "react";
import "./OrderManagement.css";
import { Button, Spinner, Toast, ToastContainer, Modal, Table } from "react-bootstrap";
import { FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders. Please check your network or login again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "success" }), 3000);
  }, []);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        fetchOrders();
        showToast("Order deleted successfully!", "success");
      } catch (err) {
        showToast("Failed to delete order.", "danger");
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="order-management container">
      <h2 className="text-center mb-4">Order Management</h2>
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}
      <OrderTable
        orders={orders}
        handleDelete={handleDelete}
        handleViewDetails={handleViewDetails}
      />
      <OrderDetailsModal
        show={showDetailsModal}
        handleClose={handleCloseDetailsModal}
        order={selectedOrder}
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

const OrderTable = ({ orders, handleDelete, handleViewDetails }) => (
  <div className="table-responsive">
    <table className="table table-bordered table-hover mt-3">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Status</th>
          <th>Total Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.user.name}</td>
            <td>{order.status}</td>
            <td>{order.total_price}</td>
            <td className="action-buttons">
              <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(order)}>
                <FaEye className="icon" /> View Details
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(order.id)}>
                <FaTrash className="icon" /> Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrderDetailsModal = ({ show, handleClose, order }) => {
    useEffect(() => {
      if (order) {
        console.log("Selected Order:", order);
        console.log("Order Items:", order.order_items); 
      }
    }, [order]);
  
    return (
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {order ? (
            <>
              <h5>User Name: {order.user.name}</h5>
              <h5>Status: {order.status}</h5>
              <h5>Total Price: ${order.total_price}</h5>
              <h5>Payment Method: {order.payment ? order.payment.payment_method : "N/A"}</h5>
              <h5>Payment Status: {order.payment ? order.payment.payment_status : "N/A"}</h5>
              <h5>Order Items:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.product ? item.product.image_url : ""}
                            alt={item.product ? item.product.name : "Unknown Product"}
                            style={{ width: "65px", height: "auto" }}
                          />
                        </td>
                        <td>{item.product ? item.product.name : "Unknown Product"}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No items in this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
export default OrderManagement;