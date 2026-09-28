import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'Mock'],
      default: 'Mock'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
      default: 'Pending'
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    // ⭐ Coupon details
    coupon: {
      code: { type: String, default: null },
      discount: { type: Number, default: 0 },
      discountType: { type: String, default: null }
    },

    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ],
      default: 'Order Placed'
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// 🆔 Auto-generate unique orderId
orderSchema.pre('validate', function () {
  if (!this.orderId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderId = `BAZ-${Date.now().toString().slice(-6)}-${random}`;
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;