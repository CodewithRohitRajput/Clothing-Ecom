const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      res.json(cart);
    } else {
      // Create empty cart if not exists
      const newCart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0
      });
      res.json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is in stock
    if (product.countInStock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    // Create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalPrice: 0
      });
    }

    // Check if item already in cart
    const existItem = cart.items.find(
      (item) => 
        item.product.toString() === productId && 
        item.size === size && 
        item.color === color
    );

    if (existItem) {
      // Update quantity if item exists
      existItem.quantity += quantity;
    } else {
      // Add new item to cart
      // Make sure we have a valid image
      const defaultImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://via.placeholder.com/150';
        
      cart.items.push({
        product: productId,
        name: product.name,
        image: defaultImage,
        price: product.price,
        size,
        color,
        quantity
      });
    }

    // Calculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    cart.updatedAt = Date.now();

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update quantity
    item.quantity = quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    cart.updatedAt = Date.now();

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== itemId
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    cart.updatedAt = Date.now();

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.updatedAt = Date.now();

    await cart.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 