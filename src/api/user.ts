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

interface ChangePasswordResponse {
  status: number;
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

export const login = async (userData: loginData) => {
  try {
    const response = await Api.post(userRoutes.userLogin, userData);
    console.log("response   :",response)
    return response;
  } catch (error) {
    // console.log("response   error :",error)

    const err: Error = error as Error;
    return errorHandle(err);
  }
};

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

export const changePassword = async (
  Id: string,
  password: string,
  oldPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    console.log(" before going to backend:", Id, password, oldPassword);
    const response = await Api.post<ChangePasswordResponse>(
      userRoutes.changePassword,
      {
        Id: Id,
        password: password,
        oldPassword: oldPassword,
      }
    );
    return response;
  } catch (error) {
    const err: any = error as Error;

    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("An error occurred");
    }
  }
};

export const getDepartments = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getDepartments
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getDoctors = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getDoctors
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getHospitals = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getHospitals
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    console.log("responce  :",response)
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getClinicks = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getClinicks
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getHomeNurses = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getHomeNurses
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getAmbulances = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await Api.get(
      `${
        userRoutes.getAmbulances
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getHospitalClinicDetails = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getHospitalClinicDetails}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getDepartmentDetails = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getDepartmentDetails}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

export const getDoctorDetails = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getDoctorDetails}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const getDoctorDetailsFromSearchPage = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getDoctorDetailsFromSearchPage}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const getHomeNurseDetails = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getHomeNurseDetails}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const getAmbulanceDetails = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getAmbulanceDetails}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};


export const createPaymentSession = async (body: any) => {
  try {
    const response = await Api.post(userRoutes.createPaymentsession, body);
    console.log("Payment session response:", response);

    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};

// In your API functions file
// export const updateStatus = async ({ bookingId, status }) => {
//   try {
//     const response = await Api.post(userRoutes.updateStatus, { bookingId, status });
//     console.log("Update status response:", response);
//     return response.data;
//   } catch (error) {
//     const err: Error = error as Error;
//     return errorHandle(err);
//   }
// };

interface UpdateStatusParams {
  bookingId: string;
  status: string;
}

export const updateStatus = async ({ bookingId, status }: UpdateStatusParams): Promise<any> => {
  try {
    const response = await Api.post(userRoutes.updateStatus, { bookingId, status });
    // console.log("Update status response:", response);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const getFullAppointmentList = async (id = "") => {
  try {
    const response = await Api.get(
      `${userRoutes.getFullAppointmentList}/${id}`
    );
    console.log("response.data  :  ", response.data);
    return response.data;
  } catch (error) {
    const err: Error = error as Error;
    return errorHandle(err);
  }
};



export const cancelAppointment = async (appointmentId: string, reason: string) => {
  try {
    console.log("cancelAppointment : ",appointmentId,reason)
    const response = await Api.put(`${userRoutes.appointmentCancel}/${appointmentId}`, { reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Add review API function
export const addReview = async (appointmentId: string, reviewData: { rating: number; review: string }) => {

  console.log("appointment id :",appointmentId)
  console.log("reviewData  :",reviewData)
  // console.log("rating  :",rating)
  const response = await Api.post(`${userRoutes.addReview}/${appointmentId}`, reviewData);
  return response.data;
};

