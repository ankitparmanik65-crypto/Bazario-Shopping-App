import { useState } from "react";
import "./ProductDetails.css";

function ProductDetails({
  product,
  addToCart,
  onBuyNow,
  onBack,
  wishlist,
  addToWishlist,
  removeFromWishlist,
  reviews = [],
  addReview,
}) {
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  // ⭐ Image gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isWishlisted = wishlist?.some((item) => item.id === product.id);

  // ⭐ Sabhi images (main + additional, duplicates removed)
  const allImages =
    product.images && product.images.length > 0
      ? [
          product.image,
          ...product.images.filter((img) => img && img !== product.image),
        ]
      : [product.image];

  // ═══════════════════════════════════════
  // Average Rating
  // ═══════════════════════════════════════
  const originalRating = Number(product.rating) || 0;
  const userRatingTotal = reviews.reduce(
    (sum, review) => sum + Number(review.rating),
    0
  );
  const totalRatingCount = reviews.length;

  const averageRating =
    totalRatingCount > 0
      ? ((originalRating + userRatingTotal) / (totalRatingCount + 1)).toFixed(1)
      : originalRating.toFixed(1);

  // ═══════════════════════════════════════
  // Submit Review
  // ═══════════════════════════════════════
  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewError("");

    if (!reviewName.trim()) {
      setReviewError("Please enter your name.");
      return;
    }
    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Please write a review.");
      return;
    }

    addReview(product.id, {
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
  };

  // ═══════════════════════════════════════
  // Star Component
  // ═══════════════════════════════════════
  const renderStars = (rating, interactive = false) => {
    return (
      <div
        className={interactive ? "review-stars interactive" : "review-stars"}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            className={star <= rating ? "star active" : "star"}
            onClick={interactive ? () => setReviewRating(star) : undefined}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // ═══════════════════════════════════════
  // Image Navigation
  // ═══════════════════════════════════════
  const goToPrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-details-page">
      {/* BACK BUTTON */}
      <button className="back-button" onClick={onBack}>
        ← Back to Products
      </button>

      {/* PRODUCT */}
      <div className="product-details">
        {/* ⭐ IMAGE GALLERY */}
        <div className="product-gallery">
          {/* Main Image */}
          <div className="product-main-image-wrapper">
            <div className="product-details-image">
              <img
                src={allImages[selectedImageIndex]}
                alt={product.name}
              />
            </div>

            {/* Navigation Arrows (only if multiple images) */}
            {allImages.length > 1 && (
              <>
                <button
                  className="gallery-nav-btn prev"
                  onClick={goToPrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="gallery-nav-btn next"
                  onClick={goToNextImage}
                  aria-label="Next image"
                >
                  ›
                </button>

                {/* Image counter */}
                <span className="gallery-counter">
                  {selectedImageIndex + 1} / {allImages.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails (only if multiple images) */}
          {allImages.length > 1 && (
            <div className="thumbnail-strip">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail-btn ${
                    i === selectedImageIndex ? "active" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-details-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          {/* Rating */}
          <div className="product-rating-summary">
            {renderStars(Math.round(Number(averageRating)))}
            <span className="rating-number">{averageRating}</span>
            <span className="review-count">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          <div className="product-details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <p className="product-description">{product.description}</p>

          {/* ACTIONS */}
          <div className="product-actions">
            <button
              className="add-to-cart-button"
              onClick={() => addToCart(product)}
            >
              🛒 Add to Cart
            </button>

            <button
              className="buy-now-button"
              onClick={() => onBuyNow(product)}
            >
              Buy Now
            </button>

            <button
              className={
                isWishlisted ? "wishlist-button active" : "wishlist-button"
              }
              onClick={() => {
                if (isWishlisted) {
                  if (removeFromWishlist) removeFromWishlist(product.id);
                } else {
                  addToWishlist(product);
                }
              }}
            >
              {isWishlisted ? "❤️ Wishlisted" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section className="reviews-section">
        <div className="reviews-header">
          <div>
            <h2>Customer Reviews</h2>
            <p>See what customers think about this product.</p>
          </div>
          <div className="overall-rating">
            <div className="overall-rating-number">{averageRating}</div>
            {renderStars(Math.round(Number(averageRating)))}
            <span>{reviews.length + 1} ratings</span>
          </div>
        </div>

        {/* Write Review */}
        <div className="write-review-card">
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
            />

            <label>Your Rating</label>
            <div className="rating-selector">
              {renderStars(reviewRating, true)}
            </div>

            <label>Your Review</label>
            <textarea
              placeholder="Share your experience with this product..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows="5"
            />

            {reviewError && <p className="review-error">{reviewError}</p>}

            <button type="submit" className="submit-review-button">
              Submit Review
            </button>
          </form>
        </div>

        {/* Review List */}
        <div className="reviews-list">
          <div className="review-card">
            <div className="review-card-header">
              <div>
                <strong>Verified Customer</strong>
                <div>{renderStars(Math.round(originalRating))}</div>
              </div>
              <span>Product Rating</span>
            </div>
            <p>
              This product has an average rating of {originalRating}/5 from the
              product catalog.
            </p>
          </div>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-card-header">
                  <div>
                    <strong>{review.name}</strong>
                    {renderStars(Number(review.rating))}
                  </div>
                  <span>{review.date}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <h3>No customer reviews yet</h3>
              <p>Be the first person to review this product.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;