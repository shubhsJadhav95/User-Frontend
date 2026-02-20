import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [medicineList, setMedicineList] = useState([]);
  const [quantities, setQuantities] = useState({});

  const increaseQty = (medicineId) => {
    setQuantities((prev) => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1,
    }));
  };

  const decreaseQty = (medicineId) => {
    setQuantities((prev) => ({
      ...prev,
      [medicineId]: prev[medicineId] > 1 ? prev[medicineId] - 1 : 0,
    }));
  };

  const removeFromCart = (medicineId) => {
  setQuantities((prevQuantities) => {
    const updatedQuantities = { ...prevQuantities };
    delete updatedQuantities[medicineId];
    return updatedQuantities;
  });
};

  const fetchMedicineList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/pharmacy/read-medicine"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMedicineList();
      setMedicineList(data);
    };

    loadData();
  }, []);

  const contextValue = {
    medicineList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;