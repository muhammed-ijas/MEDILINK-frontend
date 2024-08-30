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
    console.log(response, "got response");

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
    console.log(Id)
    const response = await Api.post(SPRoutes.getProfile, { Id: Id });
    console.log("response: ",response)
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






export const addDepartment = async (
  spId: string,
  department: string,
  doctors: { name: string; specialization: string; availableFrom: string; availableTo: string; contact: string }[]
) => {
  try {
    console.log("addepartment function got req.body",spId,department,doctors);
    const response = await Api.post(SPRoutes.addDepartment, {
      spId,
      department,
      doctors,
    });

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};
