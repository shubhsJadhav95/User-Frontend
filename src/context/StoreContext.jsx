import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [medicineList, setMedicineList] = useState([]);

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
    async function loadData() {
      const data = await fetchMedicineList();
      setMedicineList(data);
    }

    loadData();
  }, []);

  const contextValue = {
    medicineList,
    fetchMedicineList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
