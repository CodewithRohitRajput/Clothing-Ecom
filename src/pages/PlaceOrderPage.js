import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const PlaceOrderPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Check if shipping address and payment method exist
    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    
    if (!storedShippingAddress) {
      navigate('/shipping');
    } else if (!storedPaymentMethod) {
      navigate('/payment');
    } else {
      setShippingAddress(JSON.parse(storedShippingAddress));
      setPaymentMethod(storedPaymentMethod);
    }
  }, [navigate]);

  // Redirect if not logged in
  if (!user) {
    navigate('/login?redirect=placeorder');
    return null;
  }

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxPrice = itemsPrice * 0.15;
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      // Map cart items to order items format
      const orderItems = cartItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));

      const { data } = await api.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }
      );

      // Clear cart after successful order
      clearCart();
      
      // Clear localStorage
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      
      // Navigate to order details page
      navigate(`/order/${data._id}`);
      
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

  return (
    <div className="container">
      <div className="place-order-container">
        <h1>Place Order</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="order-summary">
          <div className="shipping-info">
            <h2>Shipping</h2>
            <p>
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            <p>
              <strong>Phone:</strong> {shippingAddress.phoneNumber}
            </p>
          </div>
          
          <div className="payment-info">
            <h2>Payment Method</h2>
            <p>
              <strong>Method:</strong> {paymentMethod}
            </p>
          </div>
          
          <div className="order-items">
            <h2>Order Items</h2>
            {cartItems.length === 0 ? (
              <div className="alert alert-info">Your cart is empty</div>
            ) : (
              <div className="order-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-details">
                      <Link to={`/product/${item.product}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      <p>
                        Size: <span>{item.size}</span>
                      </p>
                      <p>
                        Color: <span>{item.color}</span>
                      </p>
                    </div>
                    <div className="order-item-quantity">
                      {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="order-summary-box">
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
            type="button"
            className="btn btn-primary btn-block"
            disabled={cartItems.length === 0 || loading}
            onClick={placeOrderHandler}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage; 