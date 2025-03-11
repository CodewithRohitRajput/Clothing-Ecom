import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');

      // Fetch user orders
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          console.log('Fetching orders for user:', user._id);
          console.log('API URL:', 'http://localhost:5001/api/orders/myorders');
          console.log('Headers:', config);

          const { data } = await axios.get('http://localhost:5001/api/orders/myorders', config);
          
          console.log('Orders API response:', data);
          
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            console.error('Unexpected API response format:', data);
            setOrders([]);
          }
          
          setLoadingOrders(false);
        } catch (error) {
          console.error('Error fetching orders:', error);
          console.error('Error response:', error.response);
          
          setErrorOrders(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        'http://localhost:5001/api/auth/profile',
        { name, email, password: password ? password : undefined },
        config
      );

      // Update user in context
      updateUserProfile({
        ...user,
        name: data.name,
        email: data.email,
      });

      setSuccessMessage('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setMessage(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h2>User Profile</h2>
          
          {message && <div className="alert alert-danger">{message}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password (leave blank to keep current)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        
        <div className="col-md-8">
          <h2>My Orders</h2>
          
          {loadingOrders ? (
            <div>Loading...</div>
          ) : errorOrders ? (
            <div className="alert alert-danger">{errorOrders}</div>
          ) : orders.length === 0 ? (
            <div className="alert alert-info">
              You have no orders yet. <Link to="/">Go Shopping</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          new Date(order.paidAt).toLocaleDateString()
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          new Date(order.deliveredAt).toLocaleDateString()
                        ) : (
                          <i className="fas fa-times" style={{ color: 'red' }}></i>
                        )}
                      </td>
                      <td>
                        {order.status === 'Processing' ? (
                          <span className="badge bg-warning">Processing</span>
                        ) : order.status === 'Shipped' ? (
                          <span className="badge bg-info">Shipped</span>
                        ) : order.status === 'Delivered' ? (
                          <span className="badge bg-success">Delivered</span>
                        ) : (
                          <span className="badge bg-danger">Cancelled</span>
                        )}
                      </td>
                      <td>
                        <Link to={`/order/${order._id}`} className="btn btn-info btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 