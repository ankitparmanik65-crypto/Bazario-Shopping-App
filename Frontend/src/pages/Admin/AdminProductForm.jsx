import { useState } from 'react';
import productService from '../../services/productService';

function AdminProductForm({ product, onCancel, onSuccess }) {
  const isEdit = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    brand: product?.brand || '',
    image: product?.image || '',
    stock: product?.stock || 100,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (isEdit) {
        await productService.updateProduct(product._id, payload);
        alert('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        alert('Product created successfully!');
      }

      onSuccess();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form-container">
      <div className="admin-form-header">
        <button className="admin-back-btn" onClick={onCancel}>
          ← Back to Products
        </button>
        <h2>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
      </div>

      {error && <div className="admin-form-error">{error}</div>}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., iPhone 15 Pro"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description..."
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="999"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="beauty">Beauty</option>
              <option value="fragrances">Fragrances</option>
              <option value="furniture">Furniture</option>
              <option value="groceries">Groceries</option>
              <option value="home-decoration">Home Decoration</option>
              <option value="kitchen-accessories">Kitchen Accessories</option>
              <option value="laptops">Laptops</option>
              <option value="mens-shirts">Men's Shirts</option>
              <option value="mens-shoes">Men's Shoes</option>
              <option value="mens-watches">Men's Watches</option>
              <option value="mobile-accessories">Mobile Accessories</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="skin-care">Skin Care</option>
              <option value="smartphones">Smartphones</option>
              <option value="sports-accessories">Sports Accessories</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="tablets">Tablets</option>
              <option value="tops">Tops</option>
              <option value="vehicle">Vehicle</option>
              <option value="womens-bags">Women's Bags</option>
              <option value="womens-dresses">Women's Dresses</option>
              <option value="womens-jewellery">Women's Jewellery</option>
              <option value="womens-shoes">Women's Shoes</option>
              <option value="womens-watches">Women's Watches</option>
            </select>
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Apple"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL *</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="admin-image-preview">
            <label>Preview:</label>
            <img
              src={formData.image}
              alt="Preview"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-save-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;