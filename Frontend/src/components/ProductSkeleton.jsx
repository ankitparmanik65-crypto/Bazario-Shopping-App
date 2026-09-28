import "./ProductSkeleton.css";

function ProductSkeleton() {
  return (
    <div className="product-skeleton">
      {/* Image placeholder */}
      <div className="skeleton-image shimmer" />

      {/* Category */}
      <div className="skeleton-line skeleton-category shimmer" />

      {/* Name (2 lines) */}
      <div className="skeleton-line skeleton-title shimmer" />
      <div className="skeleton-line skeleton-title short shimmer" />

      {/* Price */}
      <div className="skeleton-line skeleton-price shimmer" />

      {/* Buttons */}
      <div className="skeleton-line skeleton-btn shimmer" />
      <div className="skeleton-line skeleton-btn shimmer" />
    </div>
  );
}

export default ProductSkeleton;