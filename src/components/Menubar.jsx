import React, { useState } from 'react';
import './Menubar.css'
import { assets } from '../assets/assets';

const Menubar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <img src={assets.NeoCare} alt="Logo" height={50} width={50} className='mx-4' />
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                    aria-expanded={!isNavCollapsed}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Explore</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Contact Us</a>
                        </li>

                    </ul>
                    <div className="d-flex align-items-center gap-4">
                        <div className="position-relative">
                            <img
                                src={assets.cart}
                                alt="cart"
                                height={40}
                                width={40}
                                className="position-relative"
                            />

                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                                3
                            </span>
                        </div>
                        <button className='btn btn-outline-primary'>Login</button>
                        <button className='btn btn-outline-success'>Register</button>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Menubar;
