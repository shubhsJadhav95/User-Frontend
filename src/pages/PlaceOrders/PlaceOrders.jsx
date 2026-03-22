import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrders.css';
import { calculateCartTotals } from '../../util/cartUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RAZORPAY_KEY } from '../../util/constants';
import { useNavigate } from 'react-router-dom';

const PlaceOrders = () => {

    const { medicineList, quantities, setQuantities, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        state: '',
        city: '',
        zip: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: '' });
        }
    };

    const cartItems = medicineList.filter(
        (medicine) => (quantities[medicine.id] || 0) > 0
    );

    const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!data.firstName.trim()) errors.firstName = "First name is required";
        if (!data.lastName.trim()) errors.lastName = "Last name is required";
        if (!data.email.trim()) errors.email = "Email is required";
        if (!data.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (data.phoneNumber.length < 10) errors.phoneNumber = "Invalid phone number";
        if (!data.address.trim()) errors.address = "Address is required";
        if (!data.state) errors.state = "State is required";
        if (!data.city) errors.city = "City is required";
        if (!data.zip) errors.zip = "Zip code is required";
        if (data.zip.length < 5) errors.zip = "Invalid zip code";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ✅ SUBMIT ORDER
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all fields correctly");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setIsProcessing(true);

        const orderData = {
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
            phoneNumber: data.phoneNumber,
            orderedItems: cartItems.map(item => ({
                medicineId: item.id,
                quantity: quantities[item.id],
                price: item.price * quantities[item.id],
                name: item.name
            })),
            amount: Number(total.toFixed(2)),
            orderStatus: "Preparing"
        };

        try {
            // 🔥 BACKEND CALL
            const response = await axios.post(
                'http://localhost:8081/api/pharmacy/order/create',
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const order = response.data;

            // ✅ MUST HAVE REAL razorpayOrderId
            if (!order.razorpayOrderId) {
                toast.error("Payment initialization failed");
                setIsProcessing(false);
                return;
            }

            openRazorpay(order);

        } catch (error) {
            console.error(error);
            toast.error("Order failed");
            setIsProcessing(false);
        }
    };

    // ✅ OPEN RAZORPAY
    const openRazorpay = (order) => {

        if (!window.Razorpay) {
            toast.error("Razorpay SDK not loaded");
            return;
        }

        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount * 100,
            currency: "INR",
            name: "Fast Pharma",
            description: "Medicine Payment",
            order_id: order.razorpayOrderId,

            handler: async (response) => {
                await verifyPayment(response, order.id);
            },

            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber
            },

            theme: { color: "#0ea5e9" },

            modal: {
                ondismiss: () => {
                    toast.error("Payment Cancelled");
                    deleteOrder(order.id);
                }
            }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (res) {
            toast.error(res.error.description);
        });

        rzp.open();
        setIsProcessing(false);
    };

    const verifyPayment = async (res, orderId) => {
        try {
            console.log("Starting payment verification...");
            console.log("Payment response:", res);
            console.log("Order ID:", orderId);

            const response = await axios.post(
                "http://localhost:8081/api/pharmacy/order/verify",
                {
                    razorpay_order_id: res.razorpay_order_id,
                    razorpay_payment_id: res.razorpay_payment_id,
                    razorpay_signature: res.razorpay_signature
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("VERIFY RESPONSE:", response);

            if (response.status === 200) {
                // Check for success flag or just status 200
                const isSuccess = response.data.success !== false;
                
                if (isSuccess) {
                    toast.success("Payment successful 🎉");

                    // Clear cart
                    await clearCart();

                    // Show success message and redirect
                    toast.success("Redirecting to your orders...");
                    
                    // Immediate redirect without timeout for better UX
                    navigate('/myorders');
                } else {
                    console.error("Payment verification failed:", response.data);
                    toast.error("Payment verification failed");
                }
            } else {
                console.error("Payment verification failed:", response.data);
                toast.error("Payment verification failed");
            }

        } catch (error) {
            console.error("Payment verification error:", error);
            
            // Even if verification fails, if we got a payment response, redirect to orders
            if (res.razorpay_payment_id) {
                console.log("Payment completed but verification failed, redirecting anyway...");
                toast.warning("Payment completed, redirecting to orders...");
                await clearCart();
                navigate('/myorders');
            } else {
                toast.error("Payment verification failed");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(
                `http://localhost:8081/api/pharmacy/order/deleteorder/${orderId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(
                "http://localhost:8081/api/pharmacy/cart/clear",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setQuantities({});
        } catch (error) {
            toast.error("Cart clear failed");
        }
    };

    return (
        <div className="checkout-wrapper">
            <div className="checkout-container">
                {/* Progress Indicator */}
                <div className="progress-tracker">
                    <div className="progress-step active">
                        <span className="step-number">1</span>
                        <span className="step-label">Shipping Info</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <span className="step-number">2</span>
                        <span className="step-label">Payment</span>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <span className="step-number">3</span>
                        <span className="step-label">Confirmation</span>
                    </div>
                </div>

                <div className="checkout-content">
                    {/* Billing Form Section */}
                    <div className="form-section">
                        <div className="section-header">
                            <h2 className="section-title">Delivery Information</h2>
                            <p className="section-subtitle">Please provide your delivery details</p>
                        </div>

                        <form onSubmit={onSubmitHandler} className="checkout-form">
                            {/* Name Row */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">👤</span>
                                        <input 
                                            type="text" 
                                            className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                                            name="firstName" 
                                            value={data.firstName} 
                                            onChange={onChangeHandler}
                                            placeholder="John"
                                        />
                                    </div>
                                    {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">👤</span>
                                        <input 
                                            type="text" 
                                            className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                                            name="lastName" 
                                            value={data.lastName} 
                                            onChange={onChangeHandler}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                                </div>
                            </div>

                            {/* Email Row */}
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="form-label">Email Address</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">✉️</span>
                                        <input 
                                            type="email" 
                                            className={`form-input ${formErrors.email ? 'error' : ''}`}
                                            name="email" 
                                            value={data.email} 
                                            onChange={onChangeHandler}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                                </div>
                            </div>

                            {/* Phone Row */}
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="form-label">Phone Number</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">📱</span>
                                        <input 
                                            type="tel" 
                                            className={`form-input ${formErrors.phoneNumber ? 'error' : ''}`}
                                            name="phoneNumber" 
                                            value={data.phoneNumber} 
                                            onChange={onChangeHandler}
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                    {formErrors.phoneNumber && <span className="error-text">{formErrors.phoneNumber}</span>}
                                </div>
                            </div>

                            {/* Address Row */}
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="form-label">Delivery Address</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">📍</span>
                                        <input 
                                            type="text" 
                                            className={`form-input ${formErrors.address ? 'error' : ''}`}
                                            name="address" 
                                            value={data.address} 
                                            onChange={onChangeHandler}
                                            placeholder="House number, street name"
                                        />
                                    </div>
                                    {formErrors.address && <span className="error-text">{formErrors.address}</span>}
                                </div>
                            </div>

                            {/* Location Row */}
                            <div className="form-row three-columns">
                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <select 
                                        className={`form-input form-select ${formErrors.state ? 'error' : ''}`}
                                        name="state" 
                                        value={data.state} 
                                        onChange={onChangeHandler}
                                    >
                                        <option value="">Select State</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                    </select>
                                    {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <select 
                                        className={`form-input form-select ${formErrors.city ? 'error' : ''}`}
                                        name="city" 
                                        value={data.city} 
                                        onChange={onChangeHandler}
                                    >
                                        <option value="">Select City</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Navi Mumbai">Navi Mumbai</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Thane">Thane</option>
                                    </select>
                                    {formErrors.city && <span className="error-text">{formErrors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Zip Code</label>
                                    <div className="form-input-wrapper">
                                        <span className="input-icon">📮</span>
                                        <input 
                                            type="text" 
                                            className={`form-input ${formErrors.zip ? 'error' : ''}`}
                                            name="zip" 
                                            value={data.zip} 
                                            onChange={onChangeHandler}
                                            placeholder="Postal code"
                                        />
                                    </div>
                                    {formErrors.zip && <span className="error-text">{formErrors.zip}</span>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className={`btn-checkout ${isProcessing || cartItems.length === 0 ? 'disabled' : ''}`}
                                type="submit"
                                disabled={cartItems.length === 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>💳</span>
                                        <span>Proceed to Payment</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Section */}
                    <div className="summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Order Summary</h3>

                            {/* Cart Items */}
                            <div className="cart-items">
                                {cartItems.length === 0 ? (
                                    <p className="empty-cart-text">Your cart is empty</p>
                                ) : (
                                    <>
                                        <div className="items-list">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="summary-item">
                                                    <div className="item-info">
                                                        <p className="item-name">{item.name}</p>
                                                        <p className="item-qty">Qty: {quantities[item.id]}</p>
                                                    </div>
                                                    <p className="item-price">₹{(item.price * quantities[item.id]).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Divider */}
                                        <div className="summary-divider"></div>

                                        {/* Breakdown */}
                                        <div className="breakdown">
                                            <div className="breakdown-row">
                                                <span className="breakdown-label">Subtotal</span>
                                                <span className="breakdown-value">₹{subtotal.toFixed(2)}</span>
                                            </div>

                                            <div className="breakdown-row">
                                                <span className="breakdown-label">Shipping</span>
                                                <span className="breakdown-value shipping">
                                                    {subtotal === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                                                </span>
                                            </div>

                                            <div className="breakdown-row">
                                                <span className="breakdown-label">Tax (GST)</span>
                                                <span className="breakdown-value">₹{tax.toFixed(2)}</span>
                                            </div>

                                            <div className="breakdown-divider"></div>

                                            <div className="breakdown-row total">
                                                <span className="breakdown-label total-label">Total</span>
                                                <span className="breakdown-value total-value">
                                                    ₹{subtotal === 0 ? "0.00" : total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Security Badges */}
                                        <div className="security-badges">
                                            <div className="badge">
                                                <span className="badge-icon">🔒</span>
                                                <span>Secure</span>
                                            </div>
                                            <div className="badge">
                                                <span className="badge-icon">✓</span>
                                                <span>Verified</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrders;