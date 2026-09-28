import "./Wishlist.css";

function Wishlist({ wishlist, removeFromWishlist, onProductClick, onBack }) {
  return (
    <div className="wishlist-page">

      {/* ═══ HEADER ═══ */}
      <div className="wishlist-header">
        <button className="wishlist-back-btn" onClick={onBack}>
          ← Back to Products
        </button>

        <h1 className="wishlist-title">
          <span className="wishlist-title-icon">❤️</span>
          <span className="wishlist-title-text">My Wishlist</span>
          <span className="wishlist-count">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </h1>
      </div>

      {/* ═══ EMPTY STATE ═══ */}
      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">💝</div>
          <h2>Your wishlist is empty</h2>
          <p>Add products you love to your wishlist.</p>
          <button className="wishlist-empty-btn" onClick={onBack}>
            Browse Products
          </button>
        </div>
      ) : (
        /* ═══ PRODUCT GRID ═══ */
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div className="wishlist-card" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                onClick={() => onProductClick(product)}
              />

              <div className="wishlist-card-info">
                <h3 onClick={() => onProductClick(product)}>
                  {product.name}
                </h3>

                <p>₹{product.price.toLocaleString("en-IN")}</p>

                <button
                  className="wishlist-remove-button"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;