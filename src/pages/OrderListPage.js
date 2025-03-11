import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get('http://localhost:5001/api/orders', config);
        
        // Check if data is an array or has orders property
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
          console.error('Unexpected API response format:', data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const updateOrderStatusHandler = async (id, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        `http://localhost:5001/api/orders/${id}/status`,
        { status },
        config
      );

      // Update orders list
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Orders</h1>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name ? order.user.name : 'Unknown User'}</td>
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
                    <div className="btn-group">
                      <Link to={`/order/${order._id}`} className="btn btn-info btn-sm">
                        Details
                      </Link>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary btn-sm dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton-${order._id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Update Status
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdownMenuButton-${order._id}`}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => updateOrderStatusHandler(order._id, 'Processing')}
                            >
                              Processing
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => updateOrderStatusHandler(order._id, 'Shipped')}
                            >
                              Shipped
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => updateOrderStatusHandler(order._id, 'Delivered')}
                            >
                              Delivered
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => updateOrderStatusHandler(order._id, 'Cancelled')}
                            >
                              Cancelled
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage; 