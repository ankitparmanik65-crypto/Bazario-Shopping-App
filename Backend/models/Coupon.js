import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    description: {
      type: String,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    maxDiscount: {
      type: Number,
      default: null    // For percentage coupons (cap)
    },
    minOrder: {
      type: Number,
      default: 0
    },
    maxUses: {
      type: Number,
      default: null    // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// ⭐ Check if coupon is valid
couponSchema.methods.isValid = function () {
  // Active check
  if (!this.isActive) {
    return { valid: false, reason: 'Coupon is inactive' };
  }

  // Expiry check
  if (this.expiresAt && new Date() > this.expiresAt) {
    return { valid: false, reason: 'Coupon has expired' };
  }

  // Usage limit check
  if (this.maxUses !== null && this.usedCount >= this.maxUses) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }

  return { valid: true };
};

// ⭐ Calculate discount
couponSchema.methods.calculateDiscount = function (subtotal) {
  if (subtotal < this.minOrder) {
    return 0;
  }

  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100;
    if (this.maxDiscount !== null) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else {
    discount = this.discountValue;
  }

  // Discount can't exceed subtotal
  return Math.min(Math.round(discount), subtotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;