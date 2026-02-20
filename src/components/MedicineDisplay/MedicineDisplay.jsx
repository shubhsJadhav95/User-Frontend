import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import MedicineItem from "../MedicineItem/MedicineItem";

const MedicineDisplay = ({ category ,searchText}) => {
  const { medicineList } = useContext(StoreContext);

  console.log("MedicineDisplay - category:", category);
  console.log("MedicineDisplay - medicineList:", medicineList);
  
  // Show all unique categories in the medicine data
  if (medicineList && medicineList.length > 0) {
    const uniqueCategories = [...new Set(medicineList.map(m => m.category))];
    console.log("Available categories in medicine data:", uniqueCategories);
  }

  // Safety fallback if medicineList is undefined
  const filteredMedicines = (medicineList || []).filter(
    (medicine) => {
      const medicineCategory = (medicine.category || "").trim().toLowerCase();
      const selectedCategory = (category || "").trim().toLowerCase();
      console.log(`Comparing: "${medicineCategory}" with "${selectedCategory}"`);
      return selectedCategory === "all" || medicineCategory === selectedCategory;
    }
  );

  console.log("MedicineDisplay - filteredMedicines:", filteredMedicines);

  return (
    <div className="container">
      <div className="row">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <MedicineItem
              key={medicine.id}   // Better than using index
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
            <h4>No medicines found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineDisplay;