import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="card-img" 
        />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        <div className="card-rating">
          {[...Array(5)].map((_, index) => (
            <i 
              key={index} 
              className={
                index < Math.floor(product.rating) 
                  ? 'fas fa-star' 
                  : index < product.rating 
                  ? 'fas fa-star-half-alt' 
                  : 'far fa-star'
              }
              style={{ color: '#ffc107' }}
            ></i>
          ))}
          <span className="rating-count">({product.numReviews})</span>
        </div>
        <p className="card-price">₹{product.price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 