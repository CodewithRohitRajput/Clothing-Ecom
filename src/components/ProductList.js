import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = ({ category, limit = 8, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          category
            ? `/api/products?category=${category}&limit=${limit}`
            : `/api/products?limit=${limit}`
        );
        setProducts(data.products);
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

    fetchProducts();
  }, [category, limit]);

  return (
    <section className="product-list">
      {title && <h2 className="section-title">{title}</h2>}
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="alert alert-danger">{error}</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList; 