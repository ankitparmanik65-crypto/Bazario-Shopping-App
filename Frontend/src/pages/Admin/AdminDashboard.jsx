import { useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminStats from "./AdminStats";
import AdminCoupons from "./AdminCoupons";   // ⭐ ADD
import "./Admin.css";

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <button className="admin-back-btn" onClick={onBack}>
          ← Back to Shopping
        </button>
        <h1>👑 Admin Dashboard</h1>
        <div className="admin-header-spacer" />
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📦 Products
        </button>
        <button
          className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📋 Orders
        </button>
        <button
          className={`admin-tab ${activeTab === "coupons" ? "active" : ""}`}   // ⭐ ADD
          onClick={() => setActiveTab("coupons")}
        >
          🎟️ Coupons
        </button>
        <button
          className={`admin-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          📊 Stats
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "coupons" && <AdminCoupons />}   {/* ⭐ ADD */}
        {activeTab === "stats" && <AdminStats />}
      </div>
    </div>
  );
}

export default AdminDashboard;