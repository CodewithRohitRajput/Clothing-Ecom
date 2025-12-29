import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('mens');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    // If no id or id is 'new', it's a new product
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const { data } = await api.get(`/api/products/${id}`);
        
        setName(data.name);
        setPrice(data.price);
        setImages(data.images || []);
        if (data.images && data.images.length > 0) {
          setImage(data.images[0]);
        }
        setCategory(data.category || 'mens');
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setSizes(data.sizes || []);
        setColors(data.colors || []);
        setIsFeatured(data.isFeatured || false);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedImages = image ? [image, ...images.filter(img => img !== image && img)] : images;

      const productData = {
        name,
        price: Number(price),
        images: updatedImages.filter(img => img), // Remove empty strings
        category: category || 'mens',
        countInStock: Number(countInStock),
        description,
        sizes: sizes.filter(s => s), // Remove empty strings
        colors: colors.filter(c => c), // Remove empty strings
        isFeatured,
      };

      if (id && id !== 'new') {
        // Update existing product
        await api.put(`/api/products/${id}`, productData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/productlist');
        }, 2000);
      } else {
        // Create new product
        const { data } = await api.post('/api/products', productData);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/product/${data._id}/edit`);
        }, 2000);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.join(', ')
        : error.response?.data?.message || error.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSizeChange = (e) => {
    const sizeInput = e.target.value;
    const sizeArray = sizeInput.split(',').map(size => size.trim());
    setSizes(sizeArray);
  };

  const handleColorChange = (e) => {
    const colorInput = e.target.value;
    const colorArray = colorInput.split(',').map(color => color.trim());
    setColors(colorArray);
  };

  const isNewProduct = !id || id === 'new';

  return (
    <div className="container">
      <div className="product-form-container">
        <div className="product-form-card">
          <h1 className="form-title">{isNewProduct ? 'Create Product' : 'Edit Product'}</h1>
          
          {loading && !isNewProduct && <div className="loading-spinner">Loading...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Product {isNewProduct ? 'created' : 'updated'} successfully!
            </div>
          )}
          
          <form onSubmit={submitHandler} className="product-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price (₹)</label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image" className="form-label">Main Image URL</label>
              <input
                type="url"
                className="form-control"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-control"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="mens">Men's</option>
                <option value="womens">Women's</option>
                <option value="kids">Kids</option>
                <option value="trending">Trending</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="countInStock" className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-control"
                id="countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="sizes" className="form-label">Available Sizes (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="sizes"
                value={sizes.join(', ')}
                onChange={handleSizeChange}
                placeholder="S, M, L, XL"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="colors" className="form-label">Available Colors (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="colors"
                value={colors.join(', ')}
                onChange={handleColorChange}
                placeholder="Red, Blue, Green"
              />
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Mark as Featured Product
              </label>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/admin/productlist')}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isNewProduct ? 'Creating...' : 'Updating...') : (isNewProduct ? 'Create Product' : 'Update Product')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage; 