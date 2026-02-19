import React from 'react';
import { Link } from "react-router-dom";

const MedicineItem = ({ name, description, id, imageUrl, price }) => {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
            <div className="card" style={{ maxWidth: "320px", height: "100%" }}>

                <div style={{ 
                    width: "100%", 
                    height: "240px", 
                    overflow: "hidden", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa"
                }}>
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            padding: "10px"
                        }}
                    />
                </div>

                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{description}</p>

                    <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 mb-0">&#8377;{price}</span>

                        <div>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-fill text-warning"></i>
                            <i className="bi bi-star-half text-warning"></i>
                            <small className="text-muted">(4.5)</small>
                        </div>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between bg-light">
                    <Link className="btn btn-primary btn-sm" to={`/medicine/${id}`}>
                        View Medicine
                    </Link>
                    <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-heart"></i>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MedicineItem;
``