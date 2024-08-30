import axios from "axios";
import Api from "../services/axios";
import userRoutes from "../services/endpoints/userEndpoints";
import errorHandle from "./error";

interface userFormData {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  fromGoogle?: boolean;
}
interface loginData {
    email?: string;
    password?: string;
}

export const signup = async (userData: userFormData) => {
  console.log(userData, "the datra");

  try {
    const response = await Api.post(userRoutes.signup, userData);
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
    const response = await Api.post(userRoutes.userOtpVerify, {
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
  phone: string
) => {
  try {
    const response = await Api.post(userRoutes.userOtpResend, {
      email: email,
      name: name,
      password: password,
      phone: phone,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const login = async (userData: loginData) =>{
  try {
    const response = await Api.post(userRoutes.userLogin, userData);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err)
  }
}


export const fOtpVerify = async (
  otp: { otp: number },
  email: { email: string }
) => {
  try {
    const response = await Api.post(userRoutes.fuserOtpVerify, {
      ...otp,
      ...email,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const resendOTP = async (email: string) => {
  try {
    const response = await Api.post(userRoutes.resendOtp, { email: email });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const resetPassword = async (
  password: { password: string },
  email: { email: string }
) => {
  try {
    const response = await Api.post(userRoutes.userResetPassword, {
      ...password,
      ...email,
    });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const forgotPassword = async (email: { email: string }) => {
  try {
    const response = await Api.post(userRoutes.userForgotPass, email);
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const getProfile = async (Id: string) => {
  try {
    const response = await Api.post(userRoutes.getProfile, { Id: Id });
    return response;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const editProfile = async (
  Id: string,
  data: { name: string; email: string; phone: string }
) => {
  try {
    const response = await Api.post(userRoutes.updateProfile, {
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
    const response = await Api.post(userRoutes.changePassword, {
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



export const getDepartments = async (page = 1, limit = 10) => {
  try {
    const response = await Api.get(`${userRoutes.getDepartments}?page=${page}&limit=${limit}`);
    // console.log("from getdepartments",response.data)
    return response.data; 
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getDoctors = async (page = 1, limit = 10) => {
  try {
    const response = await Api.get(`${userRoutes.getDoctors}?page=${page}&limit=${limit}`);
    // console.log("from getDoctors",response.data)

    return response.data; 
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getServiceProviders = async (page = 1, limit = 10) => {
  try {
    const response = await Api.get(`${userRoutes.getServiceProviders}?page=${page}&limit=${limit}`);
    // console.log("from getServiceProviders",response.data)

    return response.data; 
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

