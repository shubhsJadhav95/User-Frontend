import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const MedicineItem = ({ name, description, id, imageUrl, price }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "320px", height: "100%" }}>

        <div
          style={{
            width: "100%",
            height: "240px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Link to={`/medicine/${id}`}>
            <img
              src={imageUrl}
              alt={name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                padding: "10px",
              }}
            />
          </Link>
        </div>

        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>

          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0">&#8377;{price}</span>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between bg-light">

          <Link
            className="btn btn-primary btn-sm"
            to={`/medicine/${id}`}
          >
            View Medicine
          </Link>

          {quantities[id] > 0 ? (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => decreaseQty(id)}
              >
                -
              </button>

              <span className="fw-bold">
                {quantities[id]}
              </span>

              <button
                className="btn btn-success btn-sm"
                onClick={() => increaseQty(id)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => increaseQty(id)}
            >
              +
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default MedicineItem;