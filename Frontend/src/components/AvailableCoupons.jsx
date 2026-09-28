import { useState, useEffect } from "react";
import couponService from "../services/couponService";
import "./AvailableCoupons.css";

function AvailableCoupons({ subtotal, onApply }) {
  const [coupons, setCoupons] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch coupons when modal opens
  useEffect(() => {
    if (!isOpen || coupons.length > 0) return;

    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const data = await couponService.getAvailableCoupons();
        setCoupons(data);
      } catch (error) {
        console.error("Fetch coupons error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [isOpen, coupons.length]);

  // Check if coupon is eligible for current subtotal
  const isEligible = (coupon) => {
    return subtotal >= coupon.minOrder;
  };

  // Calculate potential discount
  const getDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      let discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
      return Math.round(discount);
    }
    return Math.min(coupon.discountValue, subtotal);
  };

  const handleApply = (code) => {
    onApply(code);
    setIsOpen(false);
  };

  return (
    <div className="available-coupons">
      {/* Trigger Button */}
      <button
        type="button"
        className="view-coupons-btn"
        onClick={() => setIsOpen(true)}
      >
        🎟️ View Available Coupons
        {coupons.length > 0 && (
          <span className="coupon-count-badge">{coupons.length}</span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="coupon-modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="coupon-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="coupon-modal-header">
              <div>
                <h3>🎟️ Available Coupons</h3>
                <p>Click on a coupon to apply it</p>
              </div>
              <button
                className="coupon-modal-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="coupon-modal-body">
              {loading ? (
                <div className="coupon-modal-loading">
                  <div className="spinner" />
                  <p>Loading coupons...</p>
                </div>
              ) : coupons.length === 0 ? (
                <div className="coupon-modal-empty">
                  <span>😕</span>
                  <h4>No coupons available</h4>
                  <p>Check back later for new offers!</p>
                </div>
              ) : (
                <div className="coupon-list">
                  {coupons.map((coupon) => {
                    const eligible = isEligible(coupon);
                    const discount = eligible ? getDiscount(coupon) : 0;

                    return (
                      <div
                        key={coupon._id}
                        className={`coupon-item ${
                          !eligible ? "disabled" : ""
                        }`}
                        onClick={() => eligible && handleApply(coupon.code)}
                      >
                        {/* Left: Discount Value */}
                        <div className="coupon-item-left">
                          <div className="coupon-item-value">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : `₹${coupon.discountValue}`}
                            <small>OFF</small>
                          </div>
                        </div>

                        {/* Middle: Details */}
                        <div className="coupon-item-middle">
                          <div className="coupon-item-code">
                            {coupon.code}
                          </div>
                          {coupon.description && (
                            <p className="coupon-item-desc">
                              {coupon.description}
                            </p>
                          )}
                          <div className="coupon-item-meta">
                            {coupon.minOrder > 0 && (
                              <span>Min: ₹{coupon.minOrder}</span>
                            )}
                            {coupon.maxDiscount && (
                              <span>Max: ₹{coupon.maxDiscount}</span>
                            )}
                          </div>
                        </div>

                        {/* Right: Action */}
                        <div className="coupon-item-right">
                          {eligible ? (
                            <>
                              <div className="coupon-item-savings">
                                Save ₹{discount}
                              </div>
                              <button
                                type="button"
                                className="coupon-item-apply-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApply(coupon.code);
                                }}
                              >
                                Apply
                              </button>
                            </>
                          ) : (
                            <div className="coupon-item-locked">
                              🔒
                              <small>
                                Add ₹{coupon.minOrder - subtotal} more
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="coupon-modal-footer">
              <p>💡 Tip: One coupon per order</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableCoupons;