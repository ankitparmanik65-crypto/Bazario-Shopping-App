import { useEffect, useState } from 'react';
import orderService from '../../services/orderService';
import productService from '../../services/productService';

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderStats, products] = await Promise.all([
          orderService.getOrderStats(),
          productService.getProducts({ limit: 1 }),
        ]);
        setStats(orderStats);
        setProductCount(products.total);
      } catch (error) {
        console.error('Stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="admin-loading">Loading stats...</div>;

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span>Total Products</span>
            <strong>{productCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span>Total Orders</span>
            <strong>{stats?.overview?.totalOrders || 0}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span>Total Revenue</span>
            <strong>₹{(stats?.overview?.totalRevenue || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span>Avg Order Value</span>
            <strong>₹{Math.round(stats?.overview?.avgOrderValue || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Orders by Status</h3>
        <div className="status-stats">
          {(stats?.statusWise || []).map((item) => (
            <div className="status-stat-row" key={item._id}>
              <span>{item._id}</span>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;