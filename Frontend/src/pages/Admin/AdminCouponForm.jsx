import { useState } from "react";
import toast from "react-hot-toast";
import couponService from "../../services/couponService";

function AdminCouponForm({ coupon, onCancel, onSuccess }) {
  const isEdit = !!coupon;

  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    maxDiscount: coupon?.maxDiscount || "",
    minOrder: coupon?.minOrder || 0,
    maxUses: coupon?.maxUses || "",
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
    expiresAt: coupon?.expiresAt
      ? new Date(coupon.expiresAt).toISOString().split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        minOrder: Number(formData.minOrder) || 0,
        maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      };

      if (isEdit) {
        await couponService.updateCoupon(coupon._id, payload);
        toast.success("Coupon updated!");
      } else {
        await couponService.createCoupon(payload);
        toast.success("Coupon created!");
      }

      onSuccess();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-coupon-form-container">
      <div className="admin-form-header">
        <button className="admin-back-btn" onClick={onCancel}>
          ← Back to Coupons
        </button>
        <h2>{isEdit ? "✏️ Edit Coupon" : "➕ Create Coupon"}</h2>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      <form className="admin-coupon-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Coupon Code *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., WELCOME10"
            required
            style={{ textTransform: "uppercase", letterSpacing: "1px" }}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., 10% off on your first order"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Discount Type *</label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Value *</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder={formData.discountType === "percentage" ? "10" : "100"}
              min="0"
              required
            />
          </div>
        </div>

        {formData.discountType === "percentage" && (
          <div className="form-group">
            <label>Max Discount (₹) - Optional</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              placeholder="e.g., 200 (cap the discount)"
              min="0"
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>Min Order Amount (₹)</label>
            <input
              type="number"
              name="minOrder"
              value={formData.minOrder}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Max Uses - Optional</label>
            <input
              type="number"
              name="maxUses"
              value={formData.maxUses}
              onChange={handleChange}
              placeholder="Unlimited"
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Expiry Date - Optional</label>
          <input
            type="date"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span>Active (coupon can be used)</span>
          </label>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="admin-save-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Coupon"
              : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminCouponForm;