import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}-${item.color}`} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`}>
                    <h3>{item.name}</h3>
                  </Link>
                  <p>
                    Size: <span>{item.size}</span>
                  </p>
                  <p>
                    Color: <span>{item.color}</span>
                  </p>
                  <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateCartQuantity(item._id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span>Items:</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 