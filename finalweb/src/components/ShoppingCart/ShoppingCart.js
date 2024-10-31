import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ShoppingCart.css'; // Add custom CSS if needed

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
    // Khởi tạo selectedItems là một đối tượng rỗng khi vào trang
    setSelectedItems({});
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (id) => {
    const confirmed = window.confirm('Are you sure you want to remove this item from your cart?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCartItems(cartItems.filter((item) => item.id !== id));
        setSelectedItems((prevSelected) => {
          const newSelected = { ...prevSelected };
          delete newSelected[id];
          return newSelected;
        });
      } catch (err) {
        console.error('Error removing item:', err);
      }
    }
  };

  const handleQuantityChange = async (id, delta) => {
    const newQuantity = cartItems.find(item => item.id === id).quantity + delta;
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:8000/api/cart/${id}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) => ({
      ...prevSelected,
      [id]: !prevSelected[id],
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      return selectedItems[item.id] ? acc + item.product.price * item.quantity : acc;
    }, 0).toFixed(2);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card">
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-7">
                    <h5 className="mb-3">
                      <Link to="/products" className="text-body">
                        <i className="fas fa-long-arrow-alt-left me-2"></i>
                        Continue shopping
                      </Link>
                    </h5>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="mb-1">Shopping cart</p>
                        <p className="mb-0">You have {cartItems.length} items in your cart</p>
                      </div>
                    </div>
                    {cartItems.length === 0 ? (
                      <p>Your cart is empty.</p>
                    ) : (
                      cartItems.map((item) => (
                        <div className="card mb-3" key={item.id}>
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <input
                                type="checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={() => handleCheckboxChange(item.id)}
                                style={{ marginRight: '10px' }}
                              />
                              <div className="d-flex flex-row align-items-center">
                                <img
                                  src={item.product.image_url}
                                  className="img-fluid rounded-3"
                                  alt={item.product.name}
                                  style={{ width: '65px' }}
                                />
                                <div className="ms-3">
                                  <h5>{item.product.name}</h5>
                                  <p className="small mb-0">{item.product.description}</p>
                                </div>
                              </div>
                              <div className="d-flex flex-row align-items-center">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  style={{ marginRight: '10px' }}
                                >
                                  -
                                </button>
                                <div style={{ width: '50px', textAlign: 'center' }}>
                                  <h5 className="fw-normal mb-0">{item.quantity}</h5>
                                </div>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  style={{ marginLeft: '10px', marginRight: '20px' }}
                                >
                                  +
                                </button>
                                <div style={{ width: '80px', textAlign: 'right', marginRight: '20px' }}>
                                  <h5 className="mb-0">${item.product.price}</h5>
                                </div>
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  style={{ color: '#cecece', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="col-lg-5">
                    <div className="card text-dark rounded-3 mt-4">
                      <div className="card-body">
                        <h5 className="mb-3">Summary</h5>
                        <hr />
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total (USD)</span>
                          <span>${calculateTotal()}</span>
                        </div>
                        <button className="btn btn-warning btn-lg btn-block" type="button">
                          <div className="d-flex justify-content-between">
                            <span>Buy Now <i className="fas fa-angle-right"></i></span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
