import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const UserListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const { data } = await api.get('/api/users');
        setUsers(data);
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

    fetchUsers();
  }, [user, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${id}`);
        
        // Update users list
        setUsers(users.filter((user) => user._id !== id));
        setSuccessMessage('User deleted successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  const toggleAdminHandler = async (id, currentAdminStatus) => {
    try {
      const { data } = await api.put(
        `/api/users/${id}`,
        { isAdmin: !currentAdminStatus }
      );

      // Update users list
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isAdmin: data.isAdmin } : user
        )
      );
      
      setSuccessMessage(`User admin status updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
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
      <h1>Users</h1>
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      
      {users.length === 0 ? (
        <div className="alert alert-info">No users found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>{userItem._id}</td>
                  <td>{userItem.name}</td>
                  <td>
                    <a href={`mailto:${userItem.email}`}>{userItem.email}</a>
                  </td>
                  <td>
                    {userItem.isAdmin ? (
                      <i className="fas fa-check" style={{ color: 'green' }}></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <button
                      className={`btn ${userItem.isAdmin ? 'btn-danger' : 'btn-success'} btn-sm me-2`}
                      onClick={() => toggleAdminHandler(userItem._id, userItem.isAdmin)}
                    >
                      {userItem.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteHandler(userItem._id)}
                      disabled={userItem._id === user._id} // Prevent deleting yourself
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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

export default UserListPage; 