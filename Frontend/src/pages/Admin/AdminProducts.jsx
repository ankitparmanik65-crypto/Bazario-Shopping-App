import { useEffect, useState } from 'react';
import productService from '../../services/productService';
import AdminProductForm from './AdminProductForm';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Products load karo
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete handler
  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts((current) => current.filter((p) => p._id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Edit handler
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Add new handler
  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  // Filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <AdminProductForm
        product={editingProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="admin-products">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search"
        />
        <button className="admin-add-btn" onClick={handleAddNew}>
          ➕ Add New Product
        </button>
      </div>

      {/* Stats */}
      <div className="admin-products-count">
        Total: <strong>{products.length}</strong> products
        {searchTerm && ` | Showing: ${filteredProducts.length}`}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="admin-loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty">
          <h3>No products found</h3>
          <p>Try a different search or add a new product.</p>
        </div>
      ) : (
        <div className="admin-products-table">
          <div className="admin-table-header">
            <div>Image</div>
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>

          {filteredProducts.map((product) => (
            <div className="admin-table-row" key={product._id}>
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="admin-product-image"
                />
              </div>
              <div className="admin-product-name">
                <strong>{product.name}</strong>
                <small>⭐ {product.rating} ({product.numReviews || 0} reviews)</small>
              </div>
              <div>
                <span className="admin-category-badge">
                  {product.category}
                </span>
              </div>
              <div className="admin-product-price">₹{product.price}</div>
              <div className={product.stock > 0 ? 'stock-ok' : 'stock-out'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
              <div className="admin-actions">
                <button
                  className="admin-edit-btn"
                  onClick={() => handleEdit(product)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="admin-delete-btn"
                  onClick={() => handleDelete(product._id, product.name)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;