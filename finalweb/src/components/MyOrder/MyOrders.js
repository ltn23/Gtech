import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./MyOrders.css"; 

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case "pending":
        return "33%"; 
      case "shipping":
        return "66%"; 
      case "completed":
        return "100%"; 
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
            {orders.length === 0 ? (
              <div className="card text-center p-5">
                <h5 className="text-muted">You have no orders.</h5>
              </div>
            ) : (
              orders.map((order, index) => (
                <div
                  className="card mb-4"
                  style={{ borderRadius: "10px" }}
                  key={order.id}
                >
                  <div className="card-header px-4 py-5">
                    <h5 className="text-muted mb-0">
                      Thanks for your Order,{" "}
                      <span style={{ color: "#a8729a" }}>
                        Order {index + 1}
                      </span>
                      !
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <p
                        className="lead fw-normal mb-0"
                        style={{ color: "#a8729a" }}
                      >
                        Receipt
                      </p>
                      <p className="small text-muted mb-0">
                        Receipt Voucher : {order.id}
                      </p>
                    </div>
                    {order.order_items.map((item) => (
                      <div className="card shadow-0 border mb-4" key={item.id}>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-2">
                              <img
                                src={item.product.image_url}
                                className="img-fluid rounded"
                                alt={item.product.name}
                              />
                            </div>
                            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0">
                                {item.product.name}
                              </p>
                            </div>
                            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                          <hr
                            className="mb-4"
                            style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                          />
                          <div className="row d-flex align-items-center">
                            <div className="row d-flex align-items-center">
                              <div className="col-md-2">
                                <p className="text-muted mb-0 small">
                                  Track Order
                                </p>
                              </div>
                              <div className="col-md-10">
                                <div
                                  className="progress"
                                  style={{
                                    height: "6px",
                                    borderRadius: "16px",
                                  }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: getProgressPercentage(
                                        order.status
                                      ),
                                      borderRadius: "16px",
                                      backgroundColor: "#a8729a",
                                    }}
                                    aria-valuenow={parseInt(
                                      getProgressPercentage(order.status),
                                      10
                                    )}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                  <p className="text-muted mt-1 mb-0 small">
                                    Pending
                                  </p>
                                  <p className="text-muted mt-1 mb-0 small">
                                    Shipping
                                  </p>
                                  <p className="text-muted mt-1 mb-0 small">
                                    Completed
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between pt-2">
                      <p className="fw-bold mb-0">Order Details</p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Total</span> $
                        {order.total_price}
                      </p>
                    </div>
                  </div>
                  <div
                    className="card-footer border-0 px-4 py-5"
                    style={{
                      backgroundColor: "#a8729a",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  >
                    <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                      Total paid:{" "}
                      <span className="h2 mb-0 ms-2">${order.total_price}</span>
                    </h5>
                  </div>
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
