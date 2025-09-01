import { InquiryDto, updateInquiryDto } from "@/lib/user-dto";
import { RegisterFormData } from "@/lib/validations";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";

const baseUrl = "http://localhost:5000/api/v1/user";
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
export const getProfile = async (): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.get(`${baseUrl}/profile`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getProfileById = async (userId:string): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.get(`${baseUrl}/agent/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateProfilePic = async (data:any): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.post(`${baseUrl}/update_profile_pic`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to update profile picture:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateIdentificationDoc = async (data:any): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.post(`${baseUrl}/update_identification_doc`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to update profile picture:",
      error.response?.data || error.message
    );
    return error;
  }
};
export const getInquiries = async (): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.get(`${baseUrl}/inquiries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get inquiries:",
      error.response?.data || error.message
    );
    return error;
  }
};
export const getAgentStats = async (): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.get(`${baseUrl}/agent_stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get inquiries:",
      error.response?.data || error.message
    );
    return error;
  }
};
export const updateInquiry = async (data:updateInquiryDto): Promise<any> => {
  try {
    console.log(token)
    const response = await axios.patch(`${baseUrl}/update_inquiry`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get inquiries:",
      error.response?.data || error.message
    );
    return error;
  }
};
