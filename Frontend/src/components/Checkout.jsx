import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import couponService from "../services/couponService";
import AvailableCoupons from "./AvailableCoupons";
import "./Checkout.css";

function Checkout({ cart, onClose, onOrderPlaced, user }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  // ⭐ Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // 🎯 Prefill user data
  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        name: user.name || current.name,
        phone: user.phone || current.phone,
      }));
    }
  }, [user]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 5000 ? 0 : 99;

  // ⭐ Discount calculation
  const discount = appliedCoupon ? appliedCoupon.discount : 0;

  const total = subtotal + shipping - discount;

  // ═══════════════════════════════════════
  // APPLY COUPON
  // ═══════════════════════════════════════

  const applyCoupon = async (code) => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);

    try {
      const coupon = await couponService.validateCoupon(
        code.trim(),
        subtotal
      );

      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      toast.success(`Coupon "${coupon.code}" applied! 🎉`);
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error(error.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    applyCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // ⭐ Auto-apply from AvailableCoupons
  const handleCouponSelect = (code) => {
    setCouponCode(code);
    applyCoupon(code);
  };

  // ═══════════════════════════════════════
  // FORM HANDLERS
  // ═══════════════════════════════════════

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!name) newErrors.name = "Please enter your full name.";
    else if (name.length < 3)
      newErrors.name = "Name must be at least 3 characters.";

    if (!phone) newErrors.phone = "Please enter your phone number.";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Phone number must contain exactly 10 digits.";

    if (!address) newErrors.address = "Please enter your delivery address.";
    else if (address.length < 10)
      newErrors.address = "Address must be at least 10 characters.";

    if (!city) newErrors.city = "Please enter your city.";
    else if (city.length < 2)
      newErrors.city = "City must be at least 2 characters.";

    if (!state) newErrors.state = "Please enter your state.";
    else if (state.length < 2)
      newErrors.state = "State must be at least 2 characters.";

    if (!pincode) newErrors.pincode = "Please enter your pincode.";
    else if (!/^\d{6}$/.test(pincode))
      newErrors.pincode = "Pincode must contain exactly 6 digits.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    onOrderPlaced({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
      country: "India",
      couponCode: appliedCoupon?.code || null,
      discount: discount,
    });
  };

  return (
    <div className="checkout-page">
      {/* HEADER */}
      <div className="checkout-header">
        <button onClick={onClose}>← Back to Cart</button>
        <h1>Order Confirmation</h1>
      </div>

      <div className="checkout-content">
        {/* DELIVERY FORM */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Delivery Information</h2>

          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit phone number"
              maxLength="10"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          {/* ADDRESS */}
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete delivery address"
              rows="4"
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>

          {/* CITY + STATE */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={errors.city ? "input-error" : ""}
              />
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? "input-error" : ""}
              />
              {errors.state && <p className="field-error">{errors.state}</p>}
            </div>
          </div>

          {/* PINCODE */}
          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              id="pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="6 digit pincode"
              maxLength="6"
              className={errors.pincode ? "input-error" : ""}
            />
            {errors.pincode && <p className="field-error">{errors.pincode}</p>}
          </div>

          {/* ⭐ COUPON SECTION */}
          <div className="coupon-section">
            <label>Have a Coupon?</label>

            {appliedCoupon ? (
              <div className="applied-coupon">
                <div className="applied-coupon-info">
                  <span className="coupon-icon">🎟️</span>
                  <div>
                    <strong>{appliedCoupon.code}</strong>
                    <small>
                      {appliedCoupon.discountType === "percentage"
                        ? `${appliedCoupon.discountValue}% off`
                        : `₹${appliedCoupon.discountValue} off`}
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={handleRemoveCoupon}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                {/* ⭐ Available Coupons Button */}
                <AvailableCoupons
                  subtotal={subtotal}
                  onApply={handleCouponSelect}
                />

                <div className="coupon-input-divider">
                  <span>OR</span>
                </div>

                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    disabled={couponLoading}
                  />
                  <button
                    type="button"
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
              </>
            )}
          </div>

          <button className="place-order-button" type="submit">
            Continue to Payment
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <hr />

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <strong>{shipping === 0 ? "FREE" : `₹${shipping}`}</strong>
          </div>

          {appliedCoupon && (
            <div className="checkout-total-row discount-row">
              <span>Discount ({appliedCoupon.code})</span>
              <strong>− ₹{discount}</strong>
            </div>
          )}

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          {shipping > 0 && (
            <p className="shipping-message">
              Add ₹{5000 - subtotal} more for FREE shipping.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;