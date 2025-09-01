import { LoginFormData, RegisterFormData } from "@/lib/validations";
import axios, { AxiosResponse } from "axios";

const baseUrl = "https://property-manager-backend-63ug.onrender.com/api/v1/auth";
// const baseUrl = "http://localhost:5000/api/v1/auth";

export const login = async (data:LoginFormData): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/login`, data);
    return response;
  } catch (error: any) {
    console.error(
      "Login failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const createAccount = async (data:RegisterFormData): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/create_account`, data);
    console.log(response)
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    return error;
  }
};
export const verifyToken = async (data:{token:string}): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/verify`, data);
    console.log(response)
    return response;
  } catch (error: any) {
    console.error(
      "Token verification failed",
      error.response?.data || error.message
    );
    throw error;
  }
};
