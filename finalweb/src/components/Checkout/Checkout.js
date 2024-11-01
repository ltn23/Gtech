import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css"; // Ensure to include any necessary styles
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, selectedItems, total } = location.state || {
    cartItems: [],
    selectedItems: {},
    total: 0,
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "", // Added email field
    phone: "",
    address: "",
    city: "", // Added city field
    country: "", // Added country field
    zip: "", // Added zip code field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await axios.post("http://localhost:8000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Order placed successfully!");
      navigate("/home"); // Redirect to home or order confirmation page
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

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
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <label className="form-label" htmlFor="zip-code">
                        Zip / Postal Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="zip-code"
                        name="zip"
                        value={userDetails.zip}
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
                              value="credit_card"
                              className="card-radio-input"
                              checked={"credit_card"}
                              
                            />
                            <span className="card-radio py-3 text-center text-truncate">
                              <i className="bx bx-credit-card d-block h2 mb-3"></i>
                              Credit / Debit Card
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
                              value="paypal"
                              className="card-radio-input"
                              checked={"paypal"}
                              
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
                              checked={"cash"}
                              
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
                <button type="submit" className="btn btn-success">
                  Confirm Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card checkout-order-summary">
            <div className="card-body">
              <div className="p-3 bg-light mb-3">
                <h5 className="font-size-16 mb-0">Order Summary</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-centered mb-0 table-nowrap">
                  <thead>
                    <tr>
                      <th style={{ width: "110px" }}>Product</th>
                      <th>Product Desc</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems
                      .filter((item) => selectedItems[item.id])
                      .map((item) => (
                        <tr key={item.id}>
                          <th scope="row">
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              className="avatar-lg rounded"
                            />
                          </th>
                          <td>
                            <h5 className="font-size-16 text-truncate">
                              {item.product.name}
                            </h5>
                            <p className="text-muted mb-0">
                              ${item.product.price} x {item.quantity}
                            </p>
                          </td>
                          <td>${item.product.price * item.quantity}</td>
                        </tr>
                      ))}
                    <tr>
                      <td colSpan="2">
                        <h5 className="font-size-14 m-0">Total:</h5>
                      </td>
                      <td>${total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
