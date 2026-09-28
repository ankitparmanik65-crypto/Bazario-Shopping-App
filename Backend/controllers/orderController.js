import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

// =========================
// HELPER: _id ya orderId se order dhundho
// =========================

const findOrderByIdOrOrderId = async (id) => {
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);

  if (isMongoId) {
    return await Order.findById(id);
  } else {
    return await Order.findOne({ orderId: id });
  }
};

// =========================
// HELPER: Initial payment status
// =========================

const getInitialPaymentStatus = (paymentMethod) => {
  if (["Mock", "Card", "UPI"].includes(paymentMethod)) {
    return "Paid"; // Online payment = immediately paid
  }
  if (paymentMethod === "COD") {
    return "Pending"; // Cash on delivery = pay later
  }
  return "Pending";
};

// ═══════════════════════════════════════
// CREATE ORDER
// ═══════════════════════════════════════

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// export const createOrder = async (req, res, next) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       paymentMethod = 'Mock',
//       discount = 0
//     } = req.body;

//     // ✅ Validation
//     if (!items || items.length === 0) {
//       res.status(400);
//       throw new Error('No order items');
//     }

//     if (!shippingAddress) {
//       res.status(400);
//       throw new Error('Shipping address is required');
//     }

//     // 🔍 Har item ko DB se verify karo
//     const productIds = items.map((item) => item.product);
//     const dbProducts = await Product.find({ _id: { $in: productIds } });

//     if (dbProducts.length !== productIds.length) {
//       res.status(404);
//       throw new Error('One or more products not found');
//     }

//     // 🔒 Actual price DB se lo
//     const verifiedItems = items.map((item) => {
//       const dbProduct = dbProducts.find(
//         (p) => p._id.toString() === item.product.toString()
//       );
//       return {
//         product: dbProduct._id,
//         name: dbProduct.name,
//         image: dbProduct.image,
//         price: dbProduct.price,
//         quantity: item.quantity
//       };
//     });

//     // 💰 Calculate totals
//     const subtotal = verifiedItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );

//     const shipping = subtotal > 500 ? 0 : 50;
//     const total = subtotal + shipping - discount;

//     // ⭐ Payment status determine karo
//     const initialPaymentStatus = getInitialPaymentStatus(paymentMethod);

//     // 📝 Order create
//     const order = await Order.create({
//       user: req.user._id,
//       items: verifiedItems,
//       shippingAddress,
//       paymentMethod,
//       paymentStatus: initialPaymentStatus,
//       subtotal,
//       shipping,
//       discount,
//       total,
//       status: 'Order Placed',
//       statusHistory: [{ status: 'Order Placed' }]
//     });

//     // 📉 Stock kam karo
//     for (const item of verifiedItems) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { stock: -item.quantity }
//       });
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       data: order
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = "Mock",
      couponCode = null, 
    } = req.body;

    // ✅ Validation
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    if (!shippingAddress) {
      res.status(400);
      throw new Error("Shipping address is required");
    }

    // 🔍 Har item ko DB se verify karo
    const productIds = items.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
      res.status(404);
      throw new Error("One or more products not found");
    }

    // 🔒 Actual price DB se lo
    const verifiedItems = items.map((item) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item.product.toString(),
      );
      return {
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
      };
    });

    // 💰 Calculate subtotal
    const subtotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 🚚 Shipping
    const shipping = subtotal > 500 ? 0 : 50;

    // ⭐ Coupon handling
    let couponData = { code: null, discount: 0, discountType: null };
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (coupon) {
        const validity = coupon.isValid();

        if (
          validity.valid &&
          subtotal >= coupon.minOrder &&
          !coupon.usedBy.some(
            (userId) => userId.toString() === req.user._id.toString(),
          )
        ) {
          discountAmount = coupon.calculateDiscount(subtotal);

          couponData = {
            code: coupon.code,
            discount: discountAmount,
            discountType: coupon.discountType,
          };

          // Update coupon usage
          coupon.usedCount += 1;
          coupon.usedBy.push(req.user._id);
          await coupon.save();
        }
      }
    }

    // 💰 Final total
    const total = subtotal + shipping - discountAmount;

    // ⭐ Payment status
    const getInitialPaymentStatus = (method) => {
      if (["Mock", "Card", "UPI"].includes(method)) return "Paid";
      if (method === "COD") return "Pending";
      return "Pending";
    };

    const initialPaymentStatus = getInitialPaymentStatus(paymentMethod);

    // 📝 Order create
    const order = await Order.create({
      user: req.user._id,
      items: verifiedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      subtotal,
      shipping,
      discount: discountAmount,
      coupon: couponData,
      total,
      status: "Order Placed",
      statusHistory: [{ status: "Order Placed" }],
    });

    // 📉 Stock kam karo
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID or OrderID
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await findOrderByIdOrOrderId(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.populate("user", "name email");
    await order.populate("items.product", "name image price");

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════
// CANCEL ORDER (with payment refund)
// ═══════════════════════════════════════

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private (owner only)
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await findOrderByIdOrOrderId(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Sirf owner cancel kar sakta hai
    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to cancel this order");
    }

    // Sirf early-stage orders cancel ho sakte hain
    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.status,
      )
    ) {
      res.status(400);
      throw new Error(`Cannot cancel order with status: ${order.status}`);
    }

    // ⭐ Status update
    order.status = "Cancelled";
    order.statusHistory.push({ status: "Cancelled" });

    // ⭐ Payment status handle karo
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
    } else if (order.paymentStatus === "Pending") {
      order.paymentStatus = "Cancelled";
    }

    await order.save();

    // 📈 Stock wapas add karo
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════
// ⭐ UPDATE ORDER STATUS (Admin)
//    + Auto payment status update
// ═══════════════════════════════════════

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${allowedStatuses.join(", ")}`);
    }

    const order = await findOrderByIdOrOrderId(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // ⭐ Already Delivered hai toh dobara Delivered mat karo
    if (order.status === "Delivered" && status === "Delivered") {
      return res.status(200).json({
        success: true,
        message: "Order already delivered",
        data: order,
      });
    }

    // ═══════════════════════════════════════
    // ⭐ PAYMENT STATUS AUTO-UPDATE LOGIC
    // ═══════════════════════════════════════

    // 📦 Order DELIVERED → COD payment received → "Paid"
    if (status === "Delivered" && order.paymentStatus === "Pending") {
      order.paymentStatus = "Paid";
    }

    // ❌ Order CANCELLED → payment adjust
    if (status === "Cancelled") {
      if (order.paymentStatus === "Paid") {
        order.paymentStatus = "Refunded";
      } else if (order.paymentStatus === "Pending") {
        order.paymentStatus = "Cancelled";
      }
    }

    // Status update
    order.status = status;
    order.statusHistory.push({ status });
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status manually (Admin)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const order = await findOrderByIdOrOrderId(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.paymentStatus = "Paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated to Paid",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order stats (Admin dashboard)
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    const statusWise = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
        },
        statusWise,
      },
    });
  } catch (error) {
    next(error);
  }
};
