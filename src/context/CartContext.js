import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // If user is not logged in, get cart from localStorage
      const localCart = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      setCartItems(localCart);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/cart');
      setCartItems(data.items || []);
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

  const addToCart = async (product, quantity, size, color) => {
    try {
      if (user) {
        setLoading(true);
        
        const { data } = await api.post(
          '/api/cart',
          {
            productId: product._id,
            quantity,
            size,
            color,
          }
        );

        setCartItems(data.items);
        setLoading(false);
      } else {
        // If user is not logged in, store in localStorage
        const existItem = cartItems.find(
          (x) => 
            x.product === product._id && 
            x.size === size && 
            x.color === color
        );

        let updatedCartItems;
        
        if (existItem) {
          updatedCartItems = cartItems.map((x) =>
            x.product === product._id && x.size === size && x.color === color
              ? { ...x, quantity: x.quantity + quantity }
              : x
          );
        } else {
          const newItem = {
            product: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            price: product.price,
            size,
            color,
            quantity,
            _id: Date.now().toString(), // Add a temporary ID for non-logged in users
          };
          
          updatedCartItems = [...cartItems, newItem];
        }
        
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    try {
      if (user) {
        setLoading(true);
        
        const { data } = await api.delete(`/api/cart/${id}`);

        setCartItems(data.items);
        setLoading(false);
      } else {
        // If user is not logged in, remove from localStorage
        const updatedCartItems = cartItems.filter((x) => x._id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const updateCartQuantity = async (id, quantity) => {
    try {
      if (user) {
        setLoading(true);
        
        const { data } = await api.put(
          `/api/cart/${id}`,
          { quantity }
        );

        setCartItems(data.items);
        setLoading(false);
      } else {
        // If user is not logged in, update in localStorage
        const updatedCartItems = cartItems.map((x) => 
          (x._id === id ? { ...x, quantity } : x)
        );
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        setLoading(true);
        
        await api.delete('/api/cart');

        setCartItems([]);
        setLoading(false);
      } else {
        // If user is not logged in, clear localStorage
        setCartItems([]);
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 