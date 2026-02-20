import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";

const Cart = () => {
    const { medicineList, increaseQty, decreaseQty, quantities, removeFromCart} = useContext(StoreContext);

    // Cart items (only items with quantity > 0)
    const cartItems = medicineList.filter(
        (medicine) => quantities[medicine.id] > 0
    );

    // Calculations
    const subtotal = cartItems.reduce(
        (acc, food) => acc + food.price * quantities[food.id],
        0
    );

    const shipping = subtotal === 0 ? 0 : 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return (
        <div className="container py-5">
            <h1 className="mb-5">Your Shopping Cart</h1>

            <div className="row">
                <div className="col-lg-8">

                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <div className="card mb-4">
                            <div className="card-body">

                                {cartItems.map((medicine) =>
                                (
                                    <div key={medicine.id} className="row cart-item mb-3">
                                        <div className="col-md-3">
                                            <img
                                                src={medicine.imageUrl}
                                                alt={medicine.name}
                                                className="img-fluid rounded"
                                                width={100}
                                            />
                                        </div>

                                        <div className="col-md-5">
                                            <h5 className="card-title">{medicine.name}</h5>
                                            <p className="text-muted">Category : {medicine.category}</p>
                                        </div>

                                        <div className="col-md-2">
                                            <div className="input-group">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => decreaseQty(medicine.id)}
                                                >
                                                    -
                                                </button>

                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm text-center quantity-input"
                                                    value={quantities[medicine.id]}
                                                    style={{ maxWidth: "100px" }}
                                                />

                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => increaseQty(medicine.id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-md-2 text-end">
                                            <p className="fw-bold">&#8377;{medicine.price * quantities[medicine.id].toFixed(2)}</p>
                                            <button className="btn btn-sm btn-outline-danger" onClick={()=>removeFromCart(medicine.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                         <hr />
                                    </div>
                                ))
                                }

                               


                            </div>
                        </div>
                    )}

                    <div className="text-start mb-4">
                        <Link to="/" className="btn btn-outline-primary">
                            <i className="bi bi-arrow-left me-2"></i>
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                    <div className="card cart-summary">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Order Summary</h5>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Subtotal</span>
                                <span>&#8377;{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping</span>
                                <span>&#8377;{subtotal===0 ? 0.0 :shipping.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Tax</span>
                                <span>&#8377;{tax.toFixed(2)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong>&#8377;{subtotal===0 ? 0.0 :total.toFixed(2)}</strong>
                            </div>

                            <button className="btn btn-primary w-100" disabled = {cartItems.length === 0}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Cart;