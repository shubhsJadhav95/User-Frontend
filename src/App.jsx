import React from 'react';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import StoreContextProvider from './context/StoreContext';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import ContactUs from './pages/Contact Us/ContactUs';
import MedicineDetails from './pages/MedicineDetails/MedicineDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrders from "./pages/PlaceOrders/PlaceOrders";
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const App = () => {
  return (
    <StoreContextProvider>
      <div>
        < Menubar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/order' element={<PlaceOrders/>} />
          <Route path='/medicine/:id' element={<MedicineDetails/>} />
        </Routes>
      </div>
    </StoreContextProvider>
  )
}

export default App;
