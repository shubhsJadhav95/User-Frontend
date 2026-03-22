import React, { useContext } from 'react';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import ContactUs from './pages/Contact Us/ContactUs';
import MedicineDetails from './pages/MedicineDetails/MedicineDetails';
import Cart from './pages/Cart/Cart';
import PlaceOrders from "./pages/PlaceOrders/PlaceOrders";
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MyOrder from './pages/MyOrder/MyOrder';
import { StoreContext } from './context/StoreContext';

const App = () => {

    const{token} = useContext(StoreContext);

  return (
    <div>
      < Menubar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/login' element={token ? <Home/> : <Login/>} />
        <Route path='/register' element={token ? <Home/> : <Register/>} />
        <Route path='/explore' element={<Explore/>} />
        <Route path='/contact-us' element={<ContactUs/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/myorders' element={token? <MyOrder/>: <Login/>} />
        <Route path='/order' element={token ? <PlaceOrders/> : <Login/>} />
        <Route path='/medicine/:id' element={<MedicineDetails/>} />
      </Routes>
    </div>
  )
}

export default App;
