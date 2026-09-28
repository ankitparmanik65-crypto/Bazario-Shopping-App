import { useEffect, useState } from 'react';
import orderService from '../../services/orderService';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const statuses = [
    'Order Placed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await orderService.getAllOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((current) =>
        current.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error('Update status error:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-toolbar">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-filter"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="admin-refresh-btn" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      <div className="admin-products-count">
        Total: <strong>{orders.length}</strong> orders
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">
          <h3>No orders found</h3>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order._id}>
              <div className="admin-order-header">
                <div>
                  <strong>{order.orderId || order._id}</strong>
                  <span className="admin-order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="admin-order-total">₹{order.total}</span>
              </div>

              <div className="admin-order-info">
                <div>
                  <span>Customer:</span>
                  <strong>{order.user?.name || 'Unknown'}</strong>
                </div>
                <div>
                  <span>Email:</span>
                  <strong>{order.user?.email || 'N/A'}</strong>
                </div>
              </div>

              <div className="admin-order-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="admin-order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              <div className="admin-order-status">
                <label>Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;