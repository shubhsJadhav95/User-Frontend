import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {fetchMedicineDetails} from '../../service/medicineService';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const MedicineDetails = () => {

    const {increaseQty} = useContext(StoreContext);
    const navigate = useNavigate();


    const addToCart = () => {
        increaseQty(data.id);
        navigate('/cart');
    }

    const { id } = useParams();

    const [data, setData] = useState({});

    

    useEffect(() => {
      const loadMedicineDetails = async() => {
      try {
      const medicineData = await fetchMedicineDetails(id);
      setData(medicineData) 
      } catch (error) {
    toast.error('error displaying the medicine details');
      }
    }
    loadMedicineDetails();
    }, [id]);

  return (
    <section className="py-5">
            <div className="container px-4 px-lg-5 my-5">
                <div className="row gx-4 gx-lg-5 align-items-center">
                    <div className="col-md-6"><img className="card-img-top mb-5 mb-md-0" src={data.imageUrl || "https://via.placeholder.com/400"} alt={data.name || "Medicine"} /></div>
                    <div className="col-md-6">
                        <div className="fs-5 mb-2">Category : <span className='badge text-bg-warning'>{data.category}</span></div>
                        <h1 className="display-5 fw-bolder">{data.name || "Medicine Details"}</h1>
                        <div className="fs-5 mb-5">
                            <span className="h5 mb-0">&#8377;{data.price || "0.00"}</span>
                        </div>
                        <p className="lead">{data.description || "No description available."}</p>
                        <div className="d-flex">
                            <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={addToCart}>
                                <i className="bi-cart-fill me-1"></i>
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default MedicineDetails;
