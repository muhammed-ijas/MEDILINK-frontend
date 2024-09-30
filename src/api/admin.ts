import Api from "../services/axios";
import AdminRoutes from "../services/endpoints/AdminEndpoints";

export const getUnVerifiedServices = async () => {
  try {
    const response = await Api.get(AdminRoutes.getUnVerifiedServices);
    return response.data;
  } catch (error) {
    console.error("Error fetching unverified services:", error);
    throw error;
  }
};


export const approveService = async (serviceProviderId: string) => {
  try {
    const response = await Api.post(AdminRoutes.approvedService, {
      id: serviceProviderId,
    });
    return response.data;
  } catch (error) {
    console.error("Error approving service provider:", error);
    throw error;
  }
};


export const getVerifiedServices = async () => {
  try {
    const response = await Api.get(AdminRoutes.getVerifiedServices);
    return response.data;
  } catch (error) {
    console.error("Error fetching unverified services:", error);
    throw error;
  }
};


export const getUsers = async () => {
  try {
    const response = await Api.get(AdminRoutes.getUsers);
    return response.data;
  } catch (error) {
    console.error("Error fetching  users:", error);
    throw error;
  }
};


export const blockUser = async (userId: string) => {
  try {
    const response = await Api.post(AdminRoutes.blockUser, { userId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to block user");
  }
};


export const unblockUser = async (userId: string) => {
  try {
    const response = await Api.post(AdminRoutes.unblockUser, { userId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to unblock user");
  }
};