import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import couponService from "../../services/couponService";
import AdminCouponForm from "./AdminCouponForm";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Fetch coupons error:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId, couponCode) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;

    try {
      await couponService.deleteCoupon(couponId);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const handleToggle = async (couponId) => {
    try {
      await couponService.toggleCouponStatus(couponId);
      toast.success("Status updated");
      fetchCoupons();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCoupon(null);
    fetchCoupons();
  };

  if (showForm) {
    return (
      <AdminCouponForm
        coupon={editingCoupon}
        onCancel={() => {
          setShowForm(false);
          setEditingCoupon(null);
        }}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="admin-coupons">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <button className="admin-add-btn" onClick={handleAddNew}>
          ➕ Create Coupon
        </button>
      </div>

      <div className="admin-products-count">
        Total: <strong>{coupons.length}</strong> coupons
      </div>

      {loading ? (
        <div className="admin-loading">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <div className="admin-empty">
          <h3>No coupons yet</h3>
          <p>Create your first coupon to get started.</p>
        </div>
      ) : (
        <div className="coupons-list">
          {coupons.map((coupon) => {
            const isExpired =
              coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const isLimitReached =
              coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;
            const isInactive = !coupon.isActive;

            return (
              <div
                key={coupon._id}
                className={`coupon-card ${
                  isExpired || isLimitReached || isInactive ? "disabled" : ""
                }`}
              >
                <div className="coupon-card-header">
                  <div className="coupon-code-wrapper">
                    <span className="coupon-code-big">{coupon.code}</span>
                    <span
                      className={`coupon-status-badge ${
                        isInactive
                          ? "inactive"
                          : isExpired
                          ? "expired"
                          : "active"
                      }`}
                    >
                      {isInactive
                        ? "Inactive"
                        : isExpired
                        ? "Expired"
                        : "Active"}
                    </span>
                  </div>

                  <div className="coupon-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() => handleEdit(coupon)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(coupon._id, coupon.code)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="coupon-card-body">
                  <div className="coupon-info-row">
                    <span className="coupon-info-label">Discount</span>
                    <strong className="coupon-info-value">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%${
                            coupon.maxDiscount
                              ? ` (max ₹${coupon.maxDiscount})`
                              : ""
                          }`
                        : `₹${coupon.discountValue}`}
                    </strong>
                  </div>

                  <div className="coupon-info-row">
                    <span className="coupon-info-label">Min Order</span>
                    <strong className="coupon-info-value">
                      ₹{coupon.minOrder}
                    </strong>
                  </div>

                  <div className="coupon-info-row">
                    <span className="coupon-info-label">Usage</span>
                    <strong className="coupon-info-value">
                      {coupon.usedCount} / {coupon.maxUses || "∞"}
                    </strong>
                  </div>

                  {coupon.expiresAt && (
                    <div className="coupon-info-row">
                      <span className="coupon-info-label">Expires</span>
                      <strong className="coupon-info-value">
                        {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
                      </strong>
                    </div>
                  )}

                  {coupon.description && (
                    <p className="coupon-description">{coupon.description}</p>
                  )}
                </div>

                <div className="coupon-card-footer">
                  <button
                    className={`toggle-status-btn ${
                      coupon.isActive ? "active" : ""
                    }`}
                    onClick={() => handleToggle(coupon._id)}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;