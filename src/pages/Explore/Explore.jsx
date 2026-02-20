import React, { useState } from 'react';
import MedicineDisplay from '../../components/MedicineDisplay/MedicineDisplay';


const Explore = () => {

  const [category, setCategory] = useState('All');
  const [searchText, setSearchtext] = useState('');
  return (

    <>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={(e)=>e.preventDefault()}>
              <div className="input-group mb-3">

                <select
                  className="form-select mt-2"
                  style={{ maxWidth: "150px" }}
                  value={category}
                  onChange={(e)=>setCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Capsules">Capsules</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Syrups">Syrups</option>
                  <option value="Injection">Injection</option>
                  <option value="Creams">Creams</option>
                </select>

                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Search your Medicine..."
                  onChange={(e) => setSearchtext(e.target.value)}
                  value={searchText}
                />

                <button
                  className="btn btn-primary mt-2"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
      <MedicineDisplay category={category}
      searchText={searchText} />
    </>

  )
}

export default Explore;
 