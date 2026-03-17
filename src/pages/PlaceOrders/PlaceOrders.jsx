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

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Cart Items
    const cartItems = medicineList.filter(
        (medicine) => (quantities[medicine.id] || 0) > 0
    );

    const { shipping, tax, total } = calculateCartTotals(cartItems, quantities);

    // ✅ Submit Order
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        const orderData = {
            userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
            phoneNumber: data.phoneNumber,

            orderedItems: cartItems.map(item => ({
                medicineId: item.id,
                quantity: quantities[item.id] || 0,
                price: item.price * (quantities[item.id] || 0),
                category: item.category,
                imageUrl: item.imageUrl,
                description: item.description,
                name: item.name
            })),

            amount: Number(total.toFixed(2)),
            orderStatus: "Preparing"
        };

        try {
            const response = await axios.post(
                'http://localhost:8081/api/pharmacy/order/create',
                orderData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 201 && response.data.razorpayOrderId) {
                initiateRazorpayPayment(response.data);
            } else {
                toast.error("Unable to place order");
            }

        } catch (error) {
            console.error(error);
            toast.error("Order failed");
        }
    };

    // ✅ Razorpay Payment
    const initiateRazorpayPayment = (order) => {

        if (!window.Razorpay) {
            toast.error("Razorpay not loaded");
            return;
        }

        const options = {
            key: RAZORPAY_KEY,
            amount: order.amount * 100,
            currency: "INR",
            name: "Fast Pharma",
            description: "Medicine Order Payment",
            order_id: order.razorpayOrderId,

            handler: async (res) => {
                await verifyPayment(res, order.id);
            },

            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber
            },

            theme: { color: "#3399cc" },

            modal: {
                ondismiss: async () => {
                    toast.error("Payment Cancelled");
                    await deleteOrder(order.id);
                }
            }
        };

        new window.Razorpay(options).open();
    };

    // ✅ Delete Order
    const deleteOrder = async (orderId) => {
        try {
            await axios.delete(
                `http://localhost:8081/api/pharmacy/order/deleteorder/${orderId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    // ✅ Clear Cart
    const clearCart = async () => {
        try {
            await axios.delete(
                "http://localhost:8081/api/cart/clear",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setQuantities({});
        } catch (error) {
            toast.error("Cart clear failed");
        }
    };

    // ✅ Verify Payment
    const verifyPayment = async (res, orderId) => {
        try {
            const response = await axios.post(
                "http://localhost:8081/api/pharmacy/order/verify",
                {
                    ...res,
                    orderId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {
                toast.success("Payment successful 🎉");
                await clearCart();
                navigate('/myorders');
            } else {
                toast.error("Payment failed");
                navigate('/');
            }

        } catch (error) {
            console.error(error);
            toast.error("Verification failed");
        }
    };

    return (
        <div className="container mt-4">
            <div className="row g-5">

                {/* 🛒 Cart Section */}
                <div className="col-md-5 col-lg-4 order-md-last">
                    <h4 className="d-flex justify-content-between">
                        <span>Your cart</span>
                        <span className="badge bg-primary">{cartItems.length}</span>
                    </h4>

                    <ul className="list-group mb-3">
                        {cartItems.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                                <div>
                                    <h6>{item.name}</h6>
                                    <small>Qty: {quantities[item.id]}</small>
                                </div>
                                ₹{(item.price * quantities[item.id]).toFixed(2)}
                            </li>
                        ))}

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Shipping</span>
                            <span>₹{shipping.toFixed(2)}</span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Tax</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </li>

                        <li className="list-group-item d-flex justify-content-between">
                            <strong>Total</strong>
                            <strong>₹{total.toFixed(2)}</strong>
                        </li>
                    </ul>
                </div>

                {/* 🧾 Billing Form */}
                <div className="col-md-7 col-lg-8">
                    <h4 className="mb-3">Billing address</h4>

                    <form onSubmit={onSubmitHandler}>
                        <div className="row g-3">

                            <div className="col-sm-6">
                                <label className="form-label">First name</label>
                                <input type="text" className="form-control" name="firstName" value={data.firstName} onChange={onChangeHandler} required />
                            </div>

                            <div className="col-sm-6">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" name="lastName" value={data.lastName} onChange={onChangeHandler} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input type="email" className="form-control" name="email" value={data.email} onChange={onChangeHandler} required />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Phone Number</label>
                                <input type="number" className="form-control" name="phoneNumber" value={data.phoneNumber} onChange={onChangeHandler} required />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" name="address" value={data.address} onChange={onChangeHandler} required />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label">State</label>
                                <select className="form-select" name="state" value={data.state} onChange={onChangeHandler} required>
                                    <option value="">Choose...</option>
                                    <option>Maharashtra</option>
                                    <option>Gujarat</option>
                                    <option>Karnataka</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">City</label>
                                <select className="form-select" name="city" value={data.city} onChange={onChangeHandler} required>
                                    <option value="">Choose...</option>
                                    <option>Mumbai</option>
                                    <option>Navi Mumbai</option>
                                    <option>Pune</option>
                                    <option>Thane</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Zip</label>
                                <input type="number" className="form-control" name="zip" value={data.zip} onChange={onChangeHandler} required />
                            </div>

                        </div>

                        <hr className="my-4" />

                        <button
                            className="w-100 btn btn-primary btn-lg"
                            type="submit"
                            disabled={cartItems.length === 0}
                        >
                            Continue to checkout
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default PlaceOrders;