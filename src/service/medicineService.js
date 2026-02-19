import axios from "axios";

const fetchMedicineList = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8081/api/pharmacy/read-medicine"
        );
        setMedicineList(response.data);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching medicines:", error);
    }
}

  const fetchMedicineDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/pharmacy/read-medicine/${id}`);
            return response.data;

        } catch (error) {
            console.error("Error fetching medicine details:", error);
            throw error;
        }
    };

export { fetchMedicineList, fetchMedicineDetails };