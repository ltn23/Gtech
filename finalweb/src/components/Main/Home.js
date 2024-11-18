import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import axios from "axios";

function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
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
        const response = await axios.get("http://localhost:8000/api/categories");
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

  if (loadingCategories || loadingProducts)
    return <p>Loading...</p>;

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
          <section className="hero-section pt-3">
            <div className="container">
              <div className="row gx-3">
                <main className="col-lg-9">
                  <div
                    className="card-banner p-5 bg-primary rounded-5"
                    style={{ height: "350px" }}
                  >
                    <div style={{ maxWidth: "500px" }}>
                      <h2 className="text-white">
                        Great products with <br /> best deals
                      </h2>
                      <p className="text-white">
                        Find the best technology products for your needs.
                      </p>
                      <button
                        onClick={() => navigate("/products")}
                        className="btn btn-light shadow-0 text-primary"
                      >
                        View more
                      </button>
                    </div>
                  </div>
                </main>
                <aside className="col-lg-3">
                  <div
                    className="card-banner h-100 rounded-5"
                    style={{ backgroundColor: "#f87217" }}
                  >
                    <div className="card-body text-center pb-5">
                      <h5 className="pt-5 text-white">Amazing Gifts</h5>
                      <p className="text-white">
                        Perfect gifts for any occasion
                      </p>
                      <button
                        onClick={() => navigate("/gifts")}
                        className="btn btn-outline-light"
                      >
                        View more
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="category-section pt-5">
            <div className="container">
              <h3 className="section-title">Categories</h3>
              <div className="row gy-4">
                {categories.map((category) => (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={category.id}
                  >
                    <div className="text-center d-flex flex-column justify-content-center">
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
                  </div>
                ))}
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
