import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
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
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ query: searchTerm });
    setLoading(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error.message}</p>;

  return (
    <div className="search-results-container">
      

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <h3>Search Results for "{searchParams.get("query")}"</h3>
      {products.length > 0 ? (
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
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
