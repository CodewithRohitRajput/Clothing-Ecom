import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-heading">FashionHub</h3>
            <p>
              Your one-stop destination for all your fashion needs. We provide high-quality
              clothing for men, women, and kids at affordable prices.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Shop</h3>
            <Link to="/category/mens" className="footer-link">
              Men's Wear
            </Link>
            <Link to="/category/womens" className="footer-link">
              Women's Wear
            </Link>
            <Link to="/category/kids" className="footer-link">
              Kids Wear
            </Link>
            <Link to="/category/trending" className="footer-link">
              Trending
            </Link>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Account</h3>
            <Link to="/profile" className="footer-link">
              My Account
            </Link>
            <Link to="/orders" className="footer-link">
              Order History
            </Link>
            <Link to="/cart" className="footer-link">
              Shopping Cart
            </Link>
            <Link to="/wishlist" className="footer-link">
              Wishlist
            </Link>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact</h3>
            <p>123 Fashion Street, Style City</p>
            <p>Phone: +1 234 567 8901</p>
            <p>Email: info@fashionhub.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FashionHub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 