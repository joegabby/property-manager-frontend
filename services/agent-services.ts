import { InquiryDto } from "@/lib/user-dto";
import { RegisterFormData } from "@/lib/validations";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";

const baseUrl = "https://property-manager-backend-63ug.onrender.com/api/v1/agent";
// const baseUrl = "http://localhost:5000/api/v1/agent";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const sendInquiry = async (data:InquiryDto): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.post(`${baseUrl}/inquiry`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to send inquiry:",
      error.response?.data || error.message
    );
    throw error;
  }
};
