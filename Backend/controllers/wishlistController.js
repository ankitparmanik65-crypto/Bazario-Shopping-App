import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Helper: user ki wishlist lo ya nayi banao
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products');

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: { user: req.user._id, products: [] }
      });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const wishlist = await getOrCreateWishlist(req.user._id);

    const alreadyIn = wishlist.products.some(
      (p) => p.toString() === req.params.productId
    );

    if (alreadyIn) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    wishlist.products.push(req.params.productId);
    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      count: wishlist.products.length,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist not found');
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      count: wishlist.products.length,
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      res.status(404);
      throw new Error('Wishlist not found');
    }

    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};