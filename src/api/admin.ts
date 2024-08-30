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