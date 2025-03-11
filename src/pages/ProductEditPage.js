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
  const [category, setCategory] = useState('');
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

    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const { data } = await api.get(`/api/products/${id}`);
        
        setName(data.name);
        setPrice(data.price);
        setImages(data.images);
        if (data.images && data.images.length > 0) {
          setImage(data.images[0]);
        }
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setSizes(data.sizes || []);
        setColors(data.colors || []);
        setIsFeatured(data.isFeatured);
        
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
      
      const updatedImages = image ? [image, ...images.filter(img => img !== image)] : images;

      await api.put(
        `/api/products/${id}`,
        {
          name,
          price,
          images: updatedImages,
          category,
          countInStock,
          description,
          sizes,
          colors,
          isFeatured,
        }
      );
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/productlist');
      }, 2000);
    } catch (error) {
      console.error('Error updating product:', error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Edit Product</h1>
          
          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Product updated successfully!
            </div>
          )}
          
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-control"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label htmlFor="countInStock" className="form-label">Count In Stock</label>
              <input
                type="number"
                className="form-control"
                id="countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="sizes" className="form-label">Sizes (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="sizes"
                value={sizes.join(', ')}
                onChange={handleSizeChange}
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="colors" className="form-label">Colors (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="colors"
                value={colors.join(', ')}
                onChange={handleColorChange}
              />
            </div>
            
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isFeatured">
                Featured Product
              </label>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage; 