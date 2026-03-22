import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const API_BASE = "http://localhost:8081/api/pharmacy";

const StoreContextProvider = ({ children }) => {

  const [medicineList, setMedicineList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState(null);

  // Fetch medicines
  const fetchMedicineList = async () => {
    try {
      const response = await axios.get(`${API_BASE}/read-medicine`);
      setMedicineList(response.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // Load cart data
  const loadCartData = async (userToken) => {
    try {
      if (!userToken) {
        console.log("No token available for cart loading");
        return;
      }
      
      const response = await axios.get(`${API_BASE}/cart`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setQuantities(response.data.items || {});
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Authentication failed - token may be expired");
        // Clear invalid token
        localStorage.removeItem("token");
        setToken(null);
      } else {
        console.error("Error loading cart:", error);
      }
    }
  };

  // Increase quantity
  const increaseQty = async (medicineId) => {

    setQuantities((prev) => ({
      ...prev,
      [medicineId]: (prev[medicineId] || 0) + 1
    }));

    if (!token) return;

    try {
      await axios.post(
        `${API_BASE}/cart`,
        { medicineId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Authentication failed - token may be expired");
        localStorage.removeItem("token");
        setToken(null);
      } else {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Decrease quantity
  const decreaseQty = async (medicineId) => {

    setQuantities((prev) => {
      const newQty = (prev[medicineId] || 0) - 1;

      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[medicineId];
        return updated;
      }

      return { ...prev, [medicineId]: newQty };
    });

    if (!token) return;

    try {
      await axios.post(
        `${API_BASE}/cart/remove`,
        { medicineId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn("Authentication failed - token may be expired");
        localStorage.removeItem("token");
        setToken(null);
      } else {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  // Remove item completely
  const removeFromCart = (medicineId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[medicineId];
      return updated;
    });
  };

  // Initial load
  useEffect(() => {

    const loadData = async () => {

      await fetchMedicineList();

      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();

  }, []);

  const contextValue = {
    medicineList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData
   
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;