import axios from "axios";

const API_URL = "http://localhost:8081/api/pharmacy";

export const registerUser = async (data) => {
  try {
    const response = await axios.post(API_URL+"/register", data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Server not responding");
    }
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(API_URL+"/login", data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Server not responding");
    }
  }
};