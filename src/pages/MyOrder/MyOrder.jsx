import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./MyOrder.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {

  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Status timeline configuration
  const STATUS_TIMELINE = [
    { key: "Preparing", label: "Preparing", icon: "📦", position: 0 },
    { key: "Shipped", label: "Shipped", icon: "🚚", position: 1 },
    { key: "Out for Delivery", label: "Out for Delivery", icon: "🚗", position: 2 },
    { key: "Delivered", label: "Delivered", icon: "✅", position: 3 }
  ];

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to cancel this order?");
      if (!confirmDelete) return;

      setCancellingOrderId(orderId);

      await axios.delete(
        `http://localhost:8081/api/pharmacy/order/deleteorder/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Order cancelled successfully");

      // ✅ Remove from UI with animation
      setOrders((prev) => prev.filter((order) => order.id !== orderId));

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");

      } else if (err.response?.status === 403) {
        toast.error("Access denied");

      } else {
        toast.error("Failed to cancel order");
      }
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Get payment display
  const getPaymentDisplay = (order) => {
    if (order.razorpayOrderId) {
      return "Paid";
    }
    return "Pending";
  };

  // ✅ FETCH ORDERS
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8081/api/pharmacy/order/user",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOrders(res.data || []);

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        toast.error("Session expired");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      } else {
        toast.error("Failed to load orders");
      }

    } finally {
      setLoading(false);
    }
  }, [token, setToken, navigate]);

  // 🚀 ON LOAD
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [token, fetchOrders, navigate]);

  // Get current status position in timeline
  const getStatusPosition = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("delivered")) return 3;
    if (statusLower.includes("delivery")) return 2;
    if (statusLower.includes("shipped")) return 1;
    if (statusLower.includes("preparing")) return 0;
    return -1;
  };

  // Get status color class
  const getStatusClass = (status) => {
    if (!status) return "status-secondary";

    const statusLower = status.toLowerCase();

    if (statusLower.includes("delivered")) return "status-success";
    if (statusLower.includes("paid")) return "status-success";
    if (statusLower.includes("pending")) return "status-warning";
    if (statusLower.includes("failed") || statusLower.includes("cancelled")) return "status-danger";
    if (statusLower.includes("shipped") || statusLower.includes("delivery")) return "status-info";

    return "status-secondary";
  };

  // ⏳ LOADING
  if (loading && orders.length === 0) {
    return (
      <div className="myorder-wrapper">
        <div className="loader-wrapper">
          <div className="loader"></div>
          <p className="loader-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // 📭 EMPTY
  if (!orders.length) {
    return (
      <div className="myorder-wrapper">
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h2 className="empty-title">No Orders Yet</h2>
          <p className="empty-subtitle">Your orders will appear here once you place your first order</p>
          <button 
            className="btn-shop"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // 🎯 UI
  return (
    <div className="myorder-wrapper">
      <div className="myorder-container">
        {/* Header */}
        <div className="myorder-header">
          <div>
            <h1 className="myorder-title">My Orders</h1>
            <p className="myorder-subtitle">Track your pharmacy orders and delivery status</p>
          </div>
          <button
            className={`btn-refresh-header ${loading ? 'loading' : ''}`}
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? '⟳ Refreshing...' : '↻ Refresh Orders'}
          </button>
        </div>

        {/* Orders Grid */}
        <div className="orders-grid">
          {orders.map((order, index) => {
            const currentStatusPosition = getStatusPosition(order.orderStatus);
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className={`order-card ${isExpanded ? 'expanded' : ''} ${cancellingOrderId === order.id ? 'cancelling' : ''}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Card Header - Click to Expand */}
                <div
                  className="order-card-header"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="order-header-left">
                    <div className="order-number">Order #{order.id?.toString().slice(-8) || "N/A"}</div>
                    <div className="order-amount">₹{(order.totalAmount || order.amount || 0).toLocaleString('en-IN')}</div>
                  </div>

                  <div className="order-header-badges">
                    <span className={`badge payment-badge ${getPaymentDisplay(order) === "Paid" ? "paid" : "pending"}`}>
                      {getPaymentDisplay(order)}
                    </span>
                    <span className={`badge status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus || "Processing"}
                    </span>
                  </div>

                  <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 8L10 11L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Card Content - Expandable */}
                <div className="order-card-content">
                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="summary-item">
                      <span className="summary-label">Amount</span>
                      <span className="summary-value">₹{order.amount?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Items</span>
                      <span className="summary-value">{order.orderedItems?.length || 0}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Delivery Address</span>
                      <span className="summary-value address">{order.userAddress || "N/A"}</span>
                    </div>
                  </div>

                  {/* Animated Status Timeline */}
                  <div className="status-timeline">
                    <div className="timeline-header">
                      <h4 className="timeline-title">Delivery Status</h4>
                    </div>

                    <div className="timeline-track">
                      {/* Timeline Progress Line */}
                      <div className="timeline-progress-line">
                        <div 
                          className="timeline-fill"
                          style={{
                            width: currentStatusPosition === -1 
                              ? '0%' 
                              : `${((currentStatusPosition) / 3) * 100}%`
                          }}
                        ></div>
                      </div>

                      {/* Timeline Nodes */}
                      <div className="timeline-nodes">
                        {STATUS_TIMELINE.map((status, idx) => {
                          const isCompleted = idx <= currentStatusPosition;
                          const isCurrent = idx === currentStatusPosition;

                          return (
                            <div
                              key={status.key}
                              className={`timeline-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                              style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                              <div className="node-circle">
                                <span className="node-icon">{status.icon}</span>
                              </div>
                              <span className="node-label">{status.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="items-section">
                    <h4 className="items-title">Items Ordered</h4>
                    <div className="items-list">
                      {order.orderedItems?.length ? (
                        order.orderedItems.map((item, i) => (
                          <div key={i} className="item-row">
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-price">₹{item.price?.toFixed(2)}</span>
                            </div>
                            <span className="item-qty">x{item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <p className="no-items">No items in this order</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="card-actions">
                    <button
                      className="btn btn-outline"
                      onClick={fetchOrders}
                      disabled={loading || cancellingOrderId === order.id}
                    >
                      <span>↻</span> Refresh Status
                    </button>
                    <button
                      className={`btn btn-danger ${cancellingOrderId === order.id ? 'cancelling' : ''}`}
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancellingOrderId === order.id}
                    >
                      {cancellingOrderId === order.id ? (
                        <>
                          <span className="spinner-mini"></span> Cancelling...
                        </>
                      ) : (
                        <>
                          <span>✕</span> Cancel Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
