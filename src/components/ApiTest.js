import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/test');
        setMessage(data.message);
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

    testApi();
  }, []);

  return (
    <div className="api-test">
      <h2>API Test</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="alert alert-danger">{error}</p>
      ) : (
        <p className="alert alert-success">{message}</p>
      )}
    </div>
  );
};

export default ApiTest; 