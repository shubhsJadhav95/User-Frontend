import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import MedicineItem from "../MedicineItem/MedicineItem";

const MedicineDisplay = () => {
    const { medicineList } = useContext(StoreContext);

    return (
        <div className="container">
            <div className="row">
                {medicineList.length > 0 ? (
                    medicineList.map((medicine,index) => (
                       
                        <MedicineItem key={index}
                        id={medicine.id}
                        name={medicine.name}
                        description={medicine.description}
                        price={medicine.price}
                        imageUrl={medicine.imageUrl}
                        category={medicine.category}
                        />

                    ))
                ) : (
                    <div className="text-center mt-4">
                        <h4>No food found.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicineDisplay;
