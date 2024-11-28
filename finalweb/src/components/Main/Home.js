import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";
import ChatDialog from "../Chatbot/ChatDialog";
import Slider from "react-slick";

function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("/dashboard");
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/categories"
        );
        setCategories(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Search function
  const handleSearch = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get(
        `http://localhost:8000/api/products?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const scrollLeft = () => {
    const container = document.querySelector(".category-list");
    container.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.querySelector(".category-list");
    container.scrollBy({ left: 200, behavior: "smooth" });
  };

  if (loadingCategories || loadingProducts) return <p>Loading...</p>;

  if (error) return <p className="text-danger">Error: {error.message}</p>;
  return (
    <div className="home-container">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <ChatDialog />
          {/* Search bar */}
          <section className="search-bar mt-4">
            <div className="container">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/search?query=${searchTerm}`)} // Navigate to SearchResults
                >
                  Search
                </button>
              </div>
            </div>
          </section>
          {/* Hero Section with Image Slideshow */}
          <section className="hero-section pt-3">
            <div className="container">
              <div className="row gx-3">
                <main className="col-lg-9">
                  <div className="hero-slider">
                    <Slider {...settings}>
                      <div onClick={() => navigate(`/products`)} style={{ cursor: 'pointer' }}>
                        <img
                          src="https://res.cloudinary.com/dsh0cqmhc/image/upload/c_fill,w_696,h_310/v1732707649/oczs7aixooavu4ikrekj.webp"
                          alt="Product 1"
                          className="img-fluid rounded-5"
                        />
                      </div>
                      <div onClick={() => navigate(`/products`)} style={{ cursor: 'pointer' }}>
                        <img
                          src="https://res.cloudinary.com/dsh0cqmhc/image/upload/t_noel1/v1732789675/noel1_tfaltw.png"
                          alt="Product 2"
                          className="img-fluid rounded-5"
                        />
                      </div>
                      <div onClick={() => navigate(`/products`)} style={{ cursor: 'pointer' }}>
                        <img
                          src="https://res.cloudinary.com/dsh0cqmhc/image/upload/t_noel1/v1732790106/noel4_sfjsgw.png"
                          alt="Product 3"
                          className="img-fluid rounded-5"
                        />
                      </div>
                    </Slider>
                  </div>
                  
                </main>
                <aside className="col-lg-3">
                  <div
                    className="card-banner h-100 rounded-5"
                    style={{ backgroundColor: "#f87217" }}
                  >
                    <div className="card-body text-center pb-5">
                      <h5 className="pt-5 text">Amazing Gifts</h5>
                      <p className="text">Perfect gifts for any occasion</p>
                      <button
                        onClick={() => navigate("/gifts")}
                        className="btn btn-outline"
                      >
                        View more
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
          <br />
          <br />
          <br />
          <section className="category-section pt-5">
            <div className="container position-relative">
              <h3 className="section-title">Categories</h3>

              <div className="category-list-wrapper">
                <div className="category-list">
                  {categories.map((category) => (
                    <div className="category-item" key={category.id}>
                      <button
                        type="button"
                        className="btn btn-outline-secondary mx-auto p-3 mb-2"
                        onClick={() =>
                          navigate(`/products?category=${category.id}`)
                        }
                      >
                        <i className="fas fa-tag fa-xl"></i>
                      </button>
                      <div className="text-dark">{category.name}</div>
                    </div>
                  ))}
                </div>

                <div className="category-arrow prev-arrow" onClick={scrollLeft}>
                  <i className="fas fa-chevron-left"></i>
                </div>
                <div
                  className="category-arrow next-arrow"
                  onClick={scrollRight}
                >
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </section>

          <section className="products-section my-5">
            <div className="container">
              <h3>New Products</h3>
              <div className="products-grid">
                {products.map((product) => (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
