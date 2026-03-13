import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Menubar.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Menubar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const { medicineList, quantities, token, setToken } = useContext(StoreContext);
    const uniqueItemsInCart = Object.values(quantities).filter(qty => qty > 0).length;
    const [active, setActive] = useState('home');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

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
                            <Link className={active === 'home' ? "nav-link fw-bold active" : "nav-link"} to="/home" onClick={() => setActive('home')}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'explore' ? "nav-link fw-bold active" : "nav-link"} to="/explore" onClick={() => setActive('explore')}>Explore</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={active === 'contact-us' ? "nav-link fw-bold active" : "nav-link"} to="/contact-us" onClick={() => setActive('contact-us')}>Contact Us</Link>
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
                        {!token ? 
                         <>
                         <Link to="/login" className="btn btn-outline-primary me-2">
                            Login
                         </Link>

                        <Link to="/register" className="btn btn-outline-success">
                            Register
                         </Link>
                         </>
                        :
                        <div className='dropdown text-end'>
                            <a href="#" className="d-block link-body text-decoration-none dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src={assets.user} alt="User" className="rounded-circle" height="40" width="40" />
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/myorders">Orders</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" onClick={logout}>Logout</Link></li>
                            </ul>
                        </div>
                       }
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Menubar;
