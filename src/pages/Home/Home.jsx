import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import MedicineDisplay from '../../components/MedicineDisplay/MedicineDisplay';

const Home = () => {

  const [category,setCategory] = useState('All');

  return (
   <main className='container'>
    <Header />
    < ExploreMenu category ={category} setCategory= {setCategory} />
    <MedicineDisplay category={category} searchText={''}/>
   </main>
  )
}

export default Home;
