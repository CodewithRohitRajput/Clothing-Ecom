import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          Fashion<span>Hub</span>
        </Link>

        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/category/mens" className="nav-link">
                Men's Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/category/womens" className="nav-link">
                Women's Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/category/kids" className="nav-link">
                Kids Wear
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/category/trending" className="nav-link">
                Trending
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link cart-icon">
                <i className="fas fa-shopping-cart"></i>
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </Link>
            </li>
            {user ? (
              <li className="nav-item dropdown">
                <span className="nav-link">
                  {user.name} <i className="fas fa-chevron-down"></i>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="dropdown-item">
                      My Orders
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <>
                      <li>
                        <Link to="/admin/productlist" className="dropdown-item">
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/orderlist" className="dropdown-item">
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/userlist" className="dropdown-item">
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 