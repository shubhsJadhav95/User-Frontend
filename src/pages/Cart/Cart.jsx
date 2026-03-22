import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals } from "../../util/cartUtils";
import "./Cart.css";

const Cart = () => {
    const { medicineList, increaseQty, decreaseQty, quantities, removeFromCart } = useContext(StoreContext);
    const navigate = useNavigate();
    const [removingId, setRemovingId] = useState(null);

    // Cart items (only items with quantity > 0)
    const cartItems = medicineList.filter(
        (medicine) => (quantities[medicine.id] || 0) > 0
    );

    // Calculations
    const { subtotal, shipping, tax, total } = calculateCartTotals(
        cartItems,
        quantities
    );

    // Handle remove with animation
    const handleRemove = (medicineId) => {
        setRemovingId(medicineId);
        setTimeout(() => {
            removeFromCart(medicineId);
            setRemovingId(null);
        }, 300);
    };

    return (
        <div className="cart-wrapper">
            <div className="cart-container">
                {/* Header */}
                <div className="cart-header">
                    <div>
                        <h1 className="cart-title">Shopping Cart</h1>
                        <p className="cart-subtitle">
                            {cartItems.length === 0 
                                ? "Your cart is empty" 
                                : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in cart`}
                        </p>
                    </div>
                </div>

                <div className="cart-content">
                    {/* Cart Items Section */}
                    <div className="cart-items-section">
                        {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <div className="empty-icon">🛍️</div>
                                <h3 className="empty-title">Your cart is empty</h3>
                                <p className="empty-text">Add some medicines to get started!</p>
                                <Link to="/" className="btn btn-primary-solid">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="items-list">
                                {cartItems.map((medicine, index) => (
                                    <div 
                                        key={medicine.id} 
                                        className={`cart-item ${removingId === medicine.id ? 'removing' : ''}`}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        {/* Product Image */}
                                        <div className="item-image">
                                            <img
                                                src={medicine.imageUrl}
                                                alt={medicine.name}
                                                className="product-img"
                                            />
                                            <div className="image-badge">{medicine.category}</div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="item-info">
                                            <h4 className="product-name">{medicine.name}</h4>
                                            <p className="product-category">Category: {medicine.category}</p>
                                            <p className="product-price">
                                                ₹{medicine.price.toFixed(2)} <span className="price-unit">per unit</span>
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="item-quantity">
                                            <button
                                                className="qty-btn qty-minus"
                                                onClick={() => decreaseQty(medicine.id)}
                                                title="Decrease quantity"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                            <input
                                                type="text"
                                                className="qty-input"
                                                value={quantities[medicine.id] || 0}
                                                readOnly
                                            />
                                            <button
                                                className="qty-btn qty-plus"
                                                onClick={() => increaseQty(medicine.id)}
                                                title="Increase quantity"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2"/>
                                                    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="item-total">
                                            <p className="total-amount">
                                                ₹{(medicine.price * (quantities[medicine.id] || 0)).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            className="btn-remove"
                                            onClick={() => handleRemove(medicine.id)}
                                            title="Remove from cart"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Order Summary</h3>

                            {/* Summary Items */}
                            <div className="summary-items">
                                <div className="summary-row">
                                    <span className="summary-label">Subtotal</span>
                                    <span className="summary-value">₹{subtotal.toFixed(2)}</span>
                                </div>

                                <div className="summary-row">
                                    <span className="summary-label">Shipping</span>
                                    <span className="summary-value shipping-value">
                                        {subtotal === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="summary-row">
                                    <span className="summary-label">Tax</span>
                                    <span className="summary-value tax-value">₹{tax.toFixed(2)}</span>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-row total-row">
                                    <span className="summary-label total-label">Total Amount</span>
                                    <span className="summary-value total-value">
                                        ₹{subtotal === 0 ? "0.00" : total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                          
                            {/* Checkout Button */}
                            <button
                                className={`btn btn-checkout ${cartItems.length === 0 ? 'disabled' : ''}`}
                                disabled={cartItems.length === 0}
                                onClick={() => navigate('/order')}
                            >
                                <span>Proceed to Checkout</span>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M3 9H15M15 9L9 3M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {/* Continue Shopping */}
                            <Link to="/" className="btn btn-secondary">
                                ← Continue Shopping
                            </Link>

                                                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
