import React from 'react';
import MedicineDisplay from '../../components/MedicineDisplay/MedicineDisplay';


const Explore = () => {
  return (

    <>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form>
              <div className="input-group mb-3">

                <select
                  className="form-select mt-2"
                  style={{ maxWidth: "150px" }}
                >
                  <option value="Capsule">Capsule</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                </select>

                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Search your Medicine..."
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
      <MedicineDisplay />
    </>

  )
}

export default Explore;
