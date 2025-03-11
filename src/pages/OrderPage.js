import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`http://localhost:5001/api/orders/${id}`, config);
        setOrder(data);
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

    if (user && id) {
      fetchOrder();
    }
  }, [id, user]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  if (!order) {
    return <div className="container">Order not found</div>;
  }

  return (
    <div className="container">
      <div className="order-container">
        <h1>Order {order._id}</h1>
        
        <div className="order-details">
          <div className="shipping-info">
            <h2>Shipping</h2>
            <p>
              <strong>Name:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <p>
              <strong>Phone:</strong> {order.shippingAddress.phoneNumber}
            </p>
            {order.isDelivered ? (
              <div className="alert alert-success">
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-warning">Not Delivered</div>
            )}
          </div>
          
          <div className="payment-info">
            <h2>Payment Method</h2>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="alert alert-success">
                Paid on {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-warning">Not Paid</div>
            )}
          </div>
          
          <div className="order-status">
            <h2>Order Status</h2>
            <p>
              <strong>Status:</strong>{' '}
              {order.status === 'Processing' ? (
                <span className="badge bg-warning">Processing</span>
              ) : order.status === 'Shipped' ? (
                <span className="badge bg-info">Shipped</span>
              ) : order.status === 'Delivered' ? (
                <span className="badge bg-success">Delivered</span>
              ) : (
                <span className="badge bg-danger">Cancelled</span>
              )}
            </p>
          </div>
          
          <div className="order-items">
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <div className="alert alert-info">Order is empty</div>
            ) : (
              <div className="order-items-list">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-details">
                      <Link to={`/product/${item.product}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      {item.size && (
                        <p>
                          Size: <span>{item.size}</span>
                        </p>
                      )}
                      {item.color && (
                        <p>
                          Color: <span>{item.color}</span>
                        </p>
                      )}
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
            <span>₹{order.itemsPrice}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>₹{order.taxPrice}</span>
          </div>
          <div className="summary-item">
            <span>Shipping:</span>
            <span>₹{order.shippingPrice}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage; 