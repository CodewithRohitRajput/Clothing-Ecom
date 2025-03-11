import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setMainImage(data.images[0]);
        setSelectedSize(data.sizes[0]);
        setSelectedColor(data.colors[0]);
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

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!rating || !comment) {
      alert('Please select a rating and enter a comment');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        config
      );

      setReviewSubmitted(true);
      setRating(0);
      setComment('');
      
      // Refresh product data to show the new review
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      alert(
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

  if (!product) {
    return <div className="container">Product not found</div>;
  }

  return (
    <div className="container">
      <div className="product-details">
        <div className="product-images">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${mainImage === image ? 'active' : ''}`}
                onClick={() => setMainImage(image)}
              >
                <img src={image} alt={`${product.name} - ${index}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
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
            <span className="rating-count">({product.numReviews} reviews)</span>
          </div>
          
          <div className="product-price">₹{product.price.toFixed(2)}</div>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          
          <div className="product-options">
            <div className="size-options">
              <h3>Size:</h3>
              <div className="size-buttons">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-button ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="color-options">
              <h3>Color:</h3>
              <div className="color-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-button ${selectedColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                  >
                    <span className="color-name">{color}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quantity-selector">
              <h3>Quantity:</h3>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="product-actions">
            <button
              className="btn btn-primary btn-block"
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Reviews</h2>
        
        {product.reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review._id} className="review">
                <div className="review-header">
                  <h4>{review.name}</h4>
                  <div className="review-rating">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={
                          index < review.rating ? 'fas fa-star' : 'far fa-star'
                        }
                        style={{ color: '#ffc107' }}
                      ></i>
                    ))}
                  </div>
                  <p className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <div className="write-review">
            <h3>Write a Review</h3>
            
            {reviewSubmitted && (
              <div className="alert alert-success">
                Review submitted successfully!
              </div>
            )}
            
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label htmlFor="rating" className="form-label">
                  Rating
                </label>
                <select
                  id="rating"
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="comment" className="form-label">
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <div className="alert alert-info">
            Please <a href="/login">sign in</a> to write a review
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage; 