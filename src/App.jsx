import React from 'react';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import StoreContextProvider from './context/StoreContext';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import ContactUs from './pages/Contact Us/ContactUs';
import MedicineDetails from './pages/MedicineDetails/MedicineDetails';
import Cart from './pages/Cart/Cart';

const App = () => {
  return (
    <StoreContextProvider>
      <div>
        < Menubar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
          <Route path='/cart' element={<Cart/>} />

        </Routes>
      </div>
    </StoreContextProvider>
  )
}

export default App;
