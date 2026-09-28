import "./OrderHistory.css";

function OrderHistory({
  orders,
  onBack,
  updateOrderStatus,
  onCancelOrder,
  isAdmin,
  onRefresh,
}) {
  const statuses = [
    "Order Placed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  // 🎯 Helper: Display ID
  const getOrderId = (order) => {
    return order?.orderId || order?._id || order?.id || "N/A";
  };

  // 🎯 Helper: MongoDB _id (API calls)
  const getOrderMongoId = (order) => {
    return order?._id || order?.id;
  };

  // 🎯 Helper: Order date
  const getOrderDate = (order) => {
    const date = order?.createdAt || order?.date;
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 🎯 Helper: Customer name
  const getCustomerName = (order) => {
    return (
      order?.shippingAddress?.fullName ||
      order?.user?.name ||
      order?.customer?.name ||
      "Customer"
    );
  };

  // 🎯 Helper: Customer email
  const getCustomerEmail = (order) => {
    return order?.user?.email || "";
  };

  // ⭐ Helper: Payment status class
  const getPaymentClass = (status) => {
    const s = (status || "Pending").toLowerCase();
    return `payment-status ${s}`;
  };

  // ⭐ Helper: Can this order be cancelled?
  const canCancelOrder = (order) => {
    const status = order?.status;
    return ![
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ].includes(status);
  };

  return (
    <div className="orders-page">
      {/* ═══ HEADER ═══ */}
      <div className="orders-header">
        <button className="orders-back-btn" onClick={onBack}>
          ← Back to Shopping
        </button>

        <h1>{isAdmin ? "👑 All Orders" : "My Orders"}</h1>

        {onRefresh && (
          <button
            className="orders-refresh-btn"
            onClick={onRefresh}
            title="Refresh orders"
          >
            🔄 Refresh
          </button>
        )}
      </div>

      {/* ═══ NO ORDERS ═══ */}
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No orders yet</h2>
          <p>
            {isAdmin
              ? "Customer orders will appear here."
              : "Your placed orders will appear here."}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const currentStatus = order.status || "Order Placed";
            const currentStep = statuses.indexOf(currentStatus);
            const isCancelled = currentStatus === "Cancelled";
            const showCancelBtn = !isAdmin && canCancelOrder(order);
            const paymentStatus = order.paymentStatus || "Pending";

            return (
              <div className="order-card" key={getOrderId(order)}>
                {/* ═══ ORDER HEADER ═══ */}
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span>Order ID</span>
                    <strong>{getOrderId(order)}</strong>
                  </div>

                  <span
                    className={`order-status ${
                      isCancelled ? "cancelled" : ""
                    }`}
                  >
                    <span className="status-small-dot"></span>
                    {currentStatus}
                  </span>
                </div>

                {/* ═══ ORDER META ═══ */}
                <div className="order-meta">
                  <div>
                    <span>Order Date</span>
                    <strong>{getOrderDate(order)}</strong>
                  </div>

                  {isAdmin && (
                    <div>
                      <span>Customer</span>
                      <strong>
                        {getCustomerName(order)}
                        {getCustomerEmail(order) && (
                          <small>{getCustomerEmail(order)}</small>
                        )}
                      </strong>
                    </div>
                  )}

                  {/* ⭐ Payment status with colored badge */}
                  <div>
                    <span>Payment</span>
                    <strong className={getPaymentClass(paymentStatus)}>
                      {paymentStatus}
                    </strong>
                  </div>
                </div>

                {/* ═══ ORDER ITEMS ═══ */}
                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div
                      className="order-item"
                      key={item.product || item._id || item.id || index}
                    >
                      <div className="order-item-name">
                        <span>{item.name}</span>
                        <small>× {item.quantity}</small>
                      </div>

                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                {/* ═══ ORDER TOTAL ═══ */}
                <div className="order-total">
                  <span>Grand Total</span>
                  <strong>₹{order.total}</strong>
                </div>

                {/* ═══ ORDER TRACKING ═══ */}
                {!isCancelled && (
                  <div className="order-tracking">
                    <h3>📦 Order Tracking</h3>

                    <div className="tracking-steps">
                      {statuses.map((status, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;
                        const isActive = index <= currentStep;

                        return (
                          <div
                            className={`tracking-wrapper ${
                              isActive ? "active" : ""
                            }`}
                            key={status}
                          >
                            <div
                              className={`tracking-step ${
                                isActive ? "active" : ""
                              } ${isCurrent ? "current" : ""}`}
                            >
                              <div className="tracking-dot">
                                {isCompleted || isCurrent ? "✓" : index + 1}
                              </div>
                              <span>{status}</span>
                            </div>

                            {index < statuses.length - 1 && (
                              <div
                                className={`tracking-line ${
                                  index < currentStep ? "active" : ""
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ═══ CANCELLED BANNER ═══ */}
                {isCancelled && (
                  <div className="cancelled-banner">
                    <span className="cancelled-icon">❌</span>
                    <div>
                      <strong>Order Cancelled</strong>
                      <p>
                        {paymentStatus === "Refunded"
                          ? "Payment has been refunded to your account."
                          : "This order has been cancelled."}
                      </p>
                    </div>
                  </div>
                )}

                {/* ═══ CANCEL ORDER BUTTON ═══ */}
                {showCancelBtn && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => onCancelOrder(getOrderMongoId(order))}
                  >
                    ❌ Cancel Order
                  </button>
                )}

                {/* ═══ UPDATE STATUS (Admin) ═══ */}
                {isAdmin && !isCancelled && (
                  <div className="update-status">
                    <div className="update-status-label">
                      <span className="update-icon">⚙</span>
                      <label>Update Order Status</label>
                    </div>

                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        updateOrderStatus(
                          getOrderMongoId(order),
                          e.target.value
                        )
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;