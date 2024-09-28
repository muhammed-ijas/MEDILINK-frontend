import Api from "../services/axios";
import AdminRoutes from "../services/endpoints/AdminEndpoints";

export const getUnVerifiedServices = async () => {
  try {
    console.log("Came in getUnVerifiedServices in api/admin.ts");
    const response = await Api.get(AdminRoutes.getUnVerifiedServices);
    console.log("response from api :",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching unverified services:", error);
    throw error;
  }
};

export const approveService = async (serviceProviderId: string) => {
  try {
    console.log("came in api approved ",serviceProviderId)
    const response = await Api.post(AdminRoutes.approvedService, {
      id: serviceProviderId,
    });
    console.log("response from backend :",response)
    return response.data;
  } catch (error) {
    console.error("Error approving service provider:", error);
    throw error;
  }
};


export const getVerifiedServices = async () => {
  try {
    const response = await Api.get(AdminRoutes.getVerifiedServices);
    // console.log("response from api :",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching unverified services:", error);
    throw error;
  }
};


export const getUsers = async () => {
  try {
    const response = await Api.get(AdminRoutes.getUsers);
    // console.log("response from api :",response.data)
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