import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ApiTest from '../components/ApiTest';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Updated to use port 5001 explicitly
        const { data: featuredData } = await axios.get('http://localhost:5001/api/products/featured');
        setFeaturedProducts(featuredData);
        
        // Updated to use port 5001 explicitly
        const { data: trendingData } = await axios.get('http://localhost:5001/api/products?category=trending');
        setTrendingProducts(trendingData.products);
        
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      {/* API Test */}
      <ApiTest />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to FashionHub</h1>
          <p>Discover the latest trends in fashion</p>
          <div className="hero-buttons">
            <a href="/category/mens" className="btn btn-primary">Shop Men's</a>
            <a href="/category/womens" className="btn btn-secondary">Shop Women's</a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="alert alert-danger">{error}</p>
        ) : (
          <div className="grid grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="grid grid-4">
          <div className="category-card">
            <a href="/category/mens">
              <div className="category-image">
                <img src="/images/mens.jpg" alt="Men's Wear" />
              </div>
              <h3>Men's Wear</h3>
            </a>
          </div>
          <div className="category-card">
            <a href="/category/womens">
              <div className="category-image">
                <img src="/images/womens.jpg" alt="Women's Wear" />
              </div>
              <h3>Women's Wear</h3>
            </a>
          </div>
          <div className="category-card">
            <a href="/category/kids">
              <div className="category-image">
                <img src="/images/kids.jpg" alt="Kids Wear" />
              </div>
              <h3>Kids Wear</h3>
            </a>
          </div>
          <div className="category-card">
            <a href="/category/trending">
              <div className="category-image">
                <img src="/images/trending.jpg" alt="Trending" />
              </div>
              <h3>Trending</h3>
            </a>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="trending-products">
        <h2 className="section-title">Trending Now</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="alert alert-danger">{error}</p>
        ) : (
          <div className="grid grid-4">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your email address"
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 