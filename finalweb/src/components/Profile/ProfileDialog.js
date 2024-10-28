import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import '../Profile/Profile.css'

const ProfileDialog = ({ show, handleClose }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (err) {
      // Handle any errors
      setError(err.message);
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // Handle loading and error states
  if (loading) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Loading...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Loading user data...</p>
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Error: {error}</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} dialogClassName="custom-small-modal" onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-lg-9 mb-4 mb-lg-0">
                <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                  <div className="row g-0">
                    <div className="col-md-4 gradient-custom text-center text-white"
                      style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                      <img
                        src={user?.avatar || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"} // Use user avatar or fallback
                        alt="Avatar"
                        className="img-fluid my-5"
                        style={{ width: '100px' }}
                      />
                      <h5 className='text-secondary'>{user?.name || "N/A"}</h5> 
                      <i className="far fa-edit mb-5"></i>
                    </div>
                    <div className="col-md-12"> 
                      <div className="card-body p-4">
                        <h6>Information</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Email</h6>
                            <p className="text-muted">{user?.email || "N/A"}</p> 
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Phone</h6>
                            <p className="text-muted">{user?.phone || "N/A"}</p> 
                          </div>
                        </div>
                        
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Address</h6>
                            <p className="text-muted">{user?.address || "N/A"}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Gender</h6>
                            <p className="text-muted">{user?.gender || "N/A"}</p>
                          </div>
                        </div>
                        {/* <div className="d-flex justify-content-start">
                          <a href="#!"><i className="fab fa-facebook-f fa-lg me-3"></i></a>
                          <a href="#!"><i className="fab fa-twitter fa-lg me-3"></i></a>
                          <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileDialog;
