import { AddPropertyFormData, RegisterFormData } from "@/lib/validations";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";

const baseUrl = "http://localhost:5000/api/v1/property";
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const createProperty = async (data: any): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/create`, data,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getAllProperties = async (params:any): Promise<any> => {
  try {
    const response = await axios.get(`${baseUrl}/properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getProperty = async (propertyId:string): Promise<any> => {
  try {
    const response = await axios.get(`${baseUrl}/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Failed to get property:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getPropertiesByAgentId = async (agentId:string): Promise<any> => {
  try {
    const response = await axios.get(`${baseUrl}/properties/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteProperty = async (propertyId:string): Promise<any> => {
  try {
    const response = await axios.delete(`${baseUrl}/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateProperty = async (propertyId:string,data:any): Promise<any> => {
  try {
    const response = await axios.patch(`${baseUrl}/update/${propertyId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    // throw error;
    return error;
  }
};
export const deletePropertyMedia = async (propertyId:string,mediaId:string): Promise<any> => {
  try {
    const response = await axios.delete(`${baseUrl}/delete/${propertyId}/media/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response;
  } catch (error: any) {
    console.error(
      "Account creation failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};