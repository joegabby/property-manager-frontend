import { InquiryDto } from "@/lib/user-dto";
import { RegisterFormData } from "@/lib/validations";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";

const baseUrl = "https://property-manager-backend-63ug.onrender.com/api/v1/user";
// const baseUrl = "http://localhost:5000/api/v1/user";
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const getAllAgents = async (params: any): Promise<any> => {
  try {
    console.log(token);
    const response = await axios.get(`${baseUrl}/get_all_agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get users:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const approveDocument = async (documentId: string): Promise<any> => {
  try {
    console.log(token);
    const response = await axios.post(`${baseUrl}/approve_doc/${documentId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to approve document",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const rejectDocument = async (data: any): Promise<any> => {
  try {
    console.log(token);
    const response = await axios.post(`${baseUrl}/reject_doc`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to reject document",
      error.response?.data || error.message
    );
    throw error;
  }
};
