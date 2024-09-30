import SPRoutes from "../services/endpoints/SPEndpoints";
import Api from "../services/axios";
import errorHandle from "./error";

interface SPFormData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  longitude?: number;
  latitude?: number;
  isVerified?: boolean;
}
interface loginData {
  email?: string;
  password?: string;
}

interface DoctorInfo {
  _id?: string; // Include if doctor IDs are managed on the backend
  name: string;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  contact: string;
}

interface EditDepartmentData {
  departmentId: string;
  name: string;
  description?: string;
  doctors: DoctorInfo[];
}

export const SPSignup = async (SPData: SPFormData) => {
  try {
    const response = await Api.post(SPRoutes.SPSignup, SPData);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const otpVerify = async (
  otp: { otp: number },
  email: { email: string }
) => {
  try {
    const response = await Api.post(SPRoutes.spOtpVerify, {
      otp,
      email,
    });

    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const resentOTP = async (
  email: string,
  name: string,
  password: string,
  phone: string,
  area: string,
  city: string,
  latitude: string,
  longitude: string,
  state: string,
  pincode: string,
  district: string
) => {
  try {
    const response = await Api.post(SPRoutes.OtpResend, {
      email: email,
      name: name,
      password: password,
      phone: phone,
      area: area,
      city: city,
      latitude: latitude,
      longitude: longitude,
      state: state,
      pincode: pincode,
      district: district,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const login = async (spData: loginData) =>{
  try {
    const response = await Api.post(SPRoutes.SPLogin,spData);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err)
  }
}


export const getProfile = async (Id: string) => {
  try {
    const response = await Api.post(SPRoutes.getProfile, { Id: Id });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const editProfile = async (
  Id: string,
  data: { 
    name: string; 
    email: string; 
    phone: string; 
    area: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
    latitude: number;
    longitude: number;
    serviceType: string,
    closingTime: string,
    openingTime: string,
  }
) => {
  try {
    const response = await Api.post(SPRoutes.updateProfile, {
      Id: Id,
      data: data,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const changePassword = async (Id: string, password: string, oldPassword: string) => {
  try {
    const response = await Api.post(SPRoutes.changePassword, {
      Id: Id,
      password: password,
      oldPassword:oldPassword
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const changeProfileImage = async (Id: string, profileImageUrl: string) => {
  try {
    const response = await Api.post(SPRoutes.changeProfileImage, {
      Id: Id,
      imageUrl: profileImageUrl,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const changeFirstDocumentImage = async (Id: string, profileImageUrl: string) => {
  try {
    const response = await Api.post(SPRoutes.changeFirstDocumentImage, {
      Id: Id,
      imageUrl: profileImageUrl,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const changeSecondDocumentImage = async (Id: string, profileImageUrl: string) => {
  try {
    const response = await Api.post(SPRoutes.changeSecondDocumentImage, {
      Id: Id,
      imageUrl: profileImageUrl,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const addDepartment = async (
  spId: string,
  department: string,
  doctors: { name: string; specialization: string; availableFrom: string; availableTo: string; dateFrom:string ;  dateEnd:string ;   contact: string }[],
  avgTime: string
) => {
  try {
    const response = await Api.post(SPRoutes.addDepartment, {
      spId,
      department,
      doctors,
      avgTime
    });
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const getAllServiceDetails = async (spId: string) => {
  try {
    const response = await Api.get(`${SPRoutes.getAllServiceDetails}/${spId}`);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const editDepartment = async (spId: string, data: EditDepartmentData) => {
  try {
    const response = await Api.post(SPRoutes.updateDepartment ,{
      spId,
      data
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating department:', error);
    throw error.response ? error.response.data : error;
  }
};



export const deleteDepartment = async (spId:string,departmentId:string) => {
  try {
    const response = await Api.post(SPRoutes.deleteDepartment ,{spId,departmentId});
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : error;
  }
};



export const getFullAppointmentList = async (id = "") => {
  try {
    const response = await Api.get(
      `${SPRoutes.getFullAppointmentList}/${id}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const approveAppointment = async (appointmentId: string) => {
  try {
    const response = await Api.put(`${SPRoutes.appointmentApprove}/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const completeAppointment = async (appointmentId: string) => {
  try {
    const response = await Api.put(`${SPRoutes.completeAppointment}/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const cancelAppointment = async (appointmentId: string, reason: string) => {
  try {
    const response = await Api.put(`${SPRoutes.appointmentCancel}/${appointmentId}`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};  


export const getRatingsAndReviews = async (SPId: string) => {
  try {
    const response = await Api.get(`${SPRoutes.getRatingsAndReviews}/${SPId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getEmergencyNumber = async (id: string) => {
  try {
    const response = await Api.get(
      `${SPRoutes.getEmergencyNumber}/${id}`
    );
    console.log("response from backend :",response.data)
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const updateEmergencyNumber = async (id: string,emergencyNumber:string) => {
  try {
    console.log("from frontend api function update :",id,emergencyNumber)
    const response = await Api.post(SPRoutes.updateEmergencyNumber,{id,emergencyNumber});
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const deleteEmergencyNumber = async (id: string) => {
  try {
    const response = await Api.post(SPRoutes.deleteEmergencyNumber,{id});
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
