import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PaymentPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');

  useEffect(() => {
    // Check if shipping address exists
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [navigate]);

  // Redirect if not logged in
  if (!user) {
    navigate('/login?redirect=payment');
    return null;
  }

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Save payment method to localStorage
    localStorage.setItem('paymentMethod', paymentMethod);
    
    // Navigate to place order page
    navigate('/placeorder');
  };

  return (
    <div className="container">
      <div className="payment-container">
        <h1>Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Cash On Delivery"
                checked={paymentMethod === 'Cash On Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash On Delivery
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal or Credit Card"
                checked={paymentMethod === 'PayPal or Credit Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PayPal or Credit Card (Coming Soon)
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage; 