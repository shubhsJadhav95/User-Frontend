import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Menubar.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Menubar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const { medicineList, quantities } = useContext(StoreContext);
    const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
               <Link to="/"> <img src={assets.NeoCare} alt="Logo" height={50} width={50} className='mx-4' /></Link>
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
                            <Link className="nav-link" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/explore">Explore</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact-us">Contact Us</Link>
                        </li>

                    </ul>
                    <div className="d-flex align-items-center gap-4">
                        <Link to={'/cart'}>
                        <div className="position-relative">
                            <img
                                src={assets.cart}
                                alt="cart"
                                height={40}
                                width={40}
                                className="position-relative"
                            />

                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                                {uniqueItemsInCart}
                            </span>
                        </div>
                        </Link>
                        <button className='btn btn-outline-primary'>Login</button>
                        <button className='btn btn-outline-success'>Register</button>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Menubar;
