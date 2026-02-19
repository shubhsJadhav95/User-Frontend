import React from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import MedicineDisplay from '../../components/MedicineDisplay/MedicineDisplay';

const Home = () => {
  return (
   <main className='container'>
    <Header />
    < ExploreMenu/>
    <MedicineDisplay/>
   </main>
  )
}

export default Home;
