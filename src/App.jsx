import React from 'react';
import Menubar from './components/Menubar/Menubar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import ContactUs from './pages/Contact Us/ContactUs';
import ExploreMenu from './components/ExploreMenu/ExploreMenu';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        < Menubar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/explore' element={<Explore/>} />
          <Route path='/contact-us' element={<ContactUs/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
