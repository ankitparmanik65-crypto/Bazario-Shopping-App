import Coupon from '../models/Coupon.js';

// ═══════════════════════════════════════
// PUBLIC: Get available coupons for users
// ═══════════════════════════════════════

// @desc    Get available coupons for users
// @route   GET /api/coupons/available
// @access  Public
export const getAvailableCoupons = async (req, res, next) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
    })
      .select(
        'code description discountType discountValue maxDiscount minOrder maxUses usedCount'
      )
      .sort({ discountValue: -1 })
      .limit(20);

    // Filter out maxed-out coupons
    const availableCoupons = coupons.filter((c) => {
      return c.maxUses === null || c.usedCount < c.maxUses;
    });

    res.status(200).json({
      success: true,
      count: availableCoupons.length,
      data: availableCoupons
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════
// VALIDATE COUPON (User side)
// ═══════════════════════════════════════

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      res.status(400);
      throw new Error('Please provide coupon code');
    }

    if (!subtotal || subtotal <= 0) {
      res.status(400);
      throw new Error('Invalid subtotal');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    // Validity check
    const validity = coupon.isValid();
    if (!validity.valid) {
      res.status(400);
      throw new Error(validity.reason);
    }

    // Min order check
    if (subtotal < coupon.minOrder) {
      res.status(400);
      throw new Error(
        `Minimum order amount for this coupon is ₹${coupon.minOrder}`
      );
    }

    // Check if user already used this coupon
    const alreadyUsed = coupon.usedBy.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (alreadyUsed) {
      res.status(400);
      throw new Error('You have already used this coupon');
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(subtotal);

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        minOrder: coupon.minOrder
      }
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      maxDiscount,
      minOrder,
      maxUses,
      isActive,
      expiresAt
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      res.status(400);
      throw new Error('Please provide code, discount type and value');
    }

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400);
      throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description: description || '',
      discountType,
      discountValue,
      maxDiscount: maxDiscount || null,
      minOrder: minOrder || 0,
      maxUses: maxUses || null,
      isActive: isActive !== undefined ? isActive : true,
      expiresAt: expiresAt || null
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    const updateData = { ...req.body };

    // If code is being updated, check for duplicates
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      const existing = await Coupon.findOne({
        code: updateData.code,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        res.status(400);
        throw new Error('Coupon code already exists');
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: updatedCoupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle coupon active status
// @route   PATCH /api/coupons/:id/toggle
// @access  Private/Admin
export const toggleCouponStatus = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      res.status(404);
      throw new Error('Coupon not found');
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};