import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Button, Card, Accordion } from "react-bootstrap";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Sắp xếp đơn hàng mới nhất ở trên cùng
      const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to fetch your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh orders after cancellation
      fetchMyOrders();
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel order. Please try again later.");
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === filterStatus);
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "pending":
        return "33%";
      case "shipping":
        return "66%";
      case "completed":
        return "100%";
      case "cancelled":
        return "0%";
      default:
        return "0%";
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <section className="h-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-10 col-xl-8">
            {/* Bộ Lọc Trạng Thái */}
            <div className="mb-4 text-center">
              <Button
                variant={filterStatus === "all" ? "primary" : "outline-primary"}
                onClick={() => setFilterStatus("all")}
                className="m-1"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "warning" : "outline-warning"}
                onClick={() => setFilterStatus("pending")}
                className="m-1"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "shipping" ? "info" : "outline-info"}
                onClick={() => setFilterStatus("shipping")}
                className="m-1"
              >
                Shipping
              </Button>
              <Button
                variant={filterStatus === "completed" ? "success" : "outline-success"}
                onClick={() => setFilterStatus("completed")}
                className="m-1"
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === "cancelled" ? "danger" : "outline-danger"}
                onClick={() => setFilterStatus("cancelled")}
                className="m-1"
              >
                Cancelled
              </Button>
            </div>

            {/* Danh Sách Đơn Hàng */}
            {getFilteredOrders().length === 0 ? (
              <div className="card text-center p-5">
                <h5 className="text-muted">No orders available for this status.</h5>
              </div>
            ) : (
              getFilteredOrders().map((order, index) => (
                <div className="card mb-4" style={{ borderRadius: "10px" }} key={order.id}>
                  <div className="card-header px-4 py-5">
                    <h5 className="text-muted mb-0">
                      My Order -{" "}
                      <span style={{ color: "#a8729a" }}>{order.status.toUpperCase()}</span>
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <p className="lead fw-normal mb-0" style={{ color: "#a8729a" }}>
                        Receipt
                      </p>
                      <p className="small text-muted mb-0">Voucher: {order.id}</p>
                    </div>

                    {/* Hiển Thị Chi Tiết Các Sản Phẩm */}
                    <Accordion alwaysOpen>
                      {order.order_items.map((item) => (
                        <Accordion.Item eventKey={item.id} key={item.id}>
                          <Accordion.Header>
                            {item.product.name} - Qty: {item.quantity}
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="d-flex justify-content-between">
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                style={{ width: "65px", height: "auto" }}
                                className="rounded"
                              />
                              <p>Quantity: {item.quantity}</p>
                              <p>${item.price}</p>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>

                    <div className="progress mt-4" style={{ height: "6px", borderRadius: "16px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: getProgressPercentage(order.status),
                          borderRadius: "16px",
                          backgroundColor: "#a8729a",
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <p className="text-muted mt-1 mb-0 small">Pending</p>
                      <p className="text-muted mt-1 mb-0 small">Shipping</p>
                      <p className="text-muted mt-1 mb-0 small">Completed</p>
                    </div>
                    <div className="d-flex justify-content-between pt-2">
                      <p className="fw-bold mb-0">Order Details</p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Total</span> ${order.total_price}
                      </p>
                    </div>
                  </div>
                  {order.status === "pending" && (
                    <div className="card-footer">
                      <Button variant="danger" onClick={() => cancelOrder(order.id)}>
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
