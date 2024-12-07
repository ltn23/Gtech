import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css"; 
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, selectedItems, total } = location.state || {
    cartItems: [],
    selectedItems: {},
    total: 0,
  };

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "", 
    phone: "",
    address: "",
    city: "", 
    country: "", 
  });

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your shopping cart is empty. Please select a product to continue.");
      return;
    }
    let products = cartItems.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const orderData = {
      total_price: parseInt(total),
      products: products,

    };

    try {
      const orderResponse = await axios.post("http://localhost:8000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const orderId = orderResponse.data.id; // lấy ID của order mới

      if (paymentMethod === "cash") {
        const paymentData = {
          order_id: orderId,
          payment_method: paymentMethod,
          total_amount: parseInt(total),
        };

        await axios.post("http://localhost:8000/api/payments", paymentData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Order placed successfully!");
        navigate("/home"); // Redirect to home or order confirmation page
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    if (paymentMethod === "paypal" && window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const payment = await actions.order.capture();
            console.log("Payment successful:", payment);

            const orderData = {
              total_price: parseInt(total),
              products: cartItems.map((item) => ({
                id: item.product.id,
                quantity: item.quantity,
                price: item.product.price,
              })),
            };

            const orderResponse = await axios.post("http://localhost:8000/api/orders", orderData, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            
            const orderId = orderResponse.data.id;

            const paymentData = {
              order_id: orderId,
              payment_method: "paypal",
              total_amount: parseInt(total),
            };

            await axios.post("http://localhost:8000/api/payments", paymentData, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            alert("Order and PayPal payment placed successfully!");
            navigate("/home");
          },
          onError: (err) => {
            console.error("PayPal checkout error:", err);
            alert("PayPal payment failed. Please try again.");
          },
        })
        .render("#paypal-button-container"); 
    }
  }, [paymentMethod]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-8">
          <div className="card">
            <div className="card-body">
              <h5 className="font-size-16 mb-1">Billing Info</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="billing-name">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billing-name"
                        name="name"
                        value={userDetails.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="billing-email">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="billing-email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="billing-phone">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billing-phone"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="billing-address">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    id="billing-address"
                    name="address"
                    rows="3"
                    value={userDetails.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="billing-country">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billing-country"
                        name="country"
                        value={userDetails.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="billing-city">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="billing-city"
                        name="city"
                        value={userDetails.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="feed-item-list">
                  <div>
                    <h5 className="font-size-16 mb-1">Payment Info</h5>
                    <p className="text-muted text-truncate mb-4">Choose your payment method:</p>
                  </div>
                  <div>
                    <h5 className="font-size-14 mb-3">Payment method:</h5>
                    <div className="row">
                      <div className="col-lg-4 col-sm-6">
                        <div>
                          <label className="card-radio-label">
                            <input
                              type="radio"
                              name="pay-method"
                              value="paypal"
                              className="card-radio-input"
                              checked={paymentMethod === "paypal"}
                              onChange={handlePaymentMethodChange}
                            />
                            <span className="card-radio py-3 text-center text-truncate">
                              <i className="bx bxl-paypal d-block h2 mb-3"></i>
                              Paypal
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6">
                        <div>
                          <label className="card-radio-label">
                            <input
                              type="radio"
                              name="pay-method"
                              value="cash"
                              className="card-radio-input"
                              checked={paymentMethod === "cash"}
                              onChange={handlePaymentMethodChange}
                            />
                            <span className="card-radio py-3 text-center text-truncate">
                              <i className="bx bx-money d-block h2 mb-3"></i>
                              <span>Cash on Delivery</span>
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3>Total: ${total}</h3>
                {paymentMethod === "cash" && (
                  <button type="submit" className="btn btn-success">
                    Confirm Order
                  </button>
                )}
              </form>
              {paymentMethod === "paypal" && <div id="paypal-button-container"></div>}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="col-xl-4">
          <div className="card checkout-order-summary">
            <div className="card-body">
              <h5 className="font-size-16 mb-3">Order Summary</h5>
              <hr />
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex flex-row align-items-center">
                    <img
                      src={item.product.image_url}
                      className="img-fluid rounded-3"
                      alt={item.product.name}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    <div>
                      <h6 className="m-0">{item.product.name}</h6>
                      <small className="text-muted">Quantity: {item.quantity}</small>
                    </div>
                  </div>
                  <div>
                    <h6 className="m-0">${(item.product.price * item.quantity).toFixed(2)}</h6>
                  </div>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <h6>Total</h6>
                <h6>${total}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
