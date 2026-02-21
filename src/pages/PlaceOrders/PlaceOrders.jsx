import React from 'react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrders.css';
import { calculateCartTotals } from '../../util/cartUtils';

const PlaceOrders = () => {
    const { medicineList, quantities } = React.useContext(StoreContext);

    // Cart items (only items with quantity > 0)
    const cartItems = medicineList.filter(
        (medicine) => quantities[medicine.id] > 0
    );

   const {shipping,tax,total} = calculateCartTotals(
    cartItems,
    quantities
   )

    return (
        <div className="container mt-4" >
            
            <main>
                <div className="row g-5">
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Your cart</span>
                            <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {cartItems.map((medicine) => (
                                <li key={medicine.id} className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">{medicine.name}</h6>
                                        <small className="text-body-secondary">Qty: {quantities[medicine.id]}</small>
                                    </div>
                                    <span className="text-body-secondary">₹{medicine.price * quantities[medicine.id]}</span>
                                </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Tax (10%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (INR)</span>
                                <strong>₹{total.toFixed(2)}</strong>
                            </li>
                        </ul>

                    </div>

                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3" >Billing address</h4>
                        <form className="needs-validation" noValidate="">
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="firstName" placeholder="Shaurya" defaultValue="" required="" />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="lastName" placeholder="Singh" defaultValue="" required="" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text">@</span>
                                        <input type="email" className="form-control" id="username" placeholder="email" required="" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input type="number" className="form-control" id="phone" placeholder="9421120240" required="" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="address2" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="address" placeholder="Apartment or suite" />
                                </div>
                                <div className="col-md-5">
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <select className="form-select" id="country" required="">
                                        <option value="">Choose...</option>
                                        <option>India</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-select" id="state" required="">
                                        <option value="">Choose...</option>
                                        <option>Maharashtra</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="zip" className="form-label">Zip</label>
                                    <input type="number" className="form-control" id="zip" placeholder="415524" required="" />
                                </div>
                            </div>
                            <hr className="my-4" />
                            <button className="w-100 btn btn-primary btn-lg" type="submit" disabled={cartItems.length===0}>Continue to checkout</button>
                        </form>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default PlaceOrders;