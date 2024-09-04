const userRoutes={

    signup:'user/signup',
    userOtpVerify:'/user/verify',
    fuserOtpVerify:'/user/fVerify',
    userOtpResend:'user/resend_otp',
    userLogin:'user/login',
    userForgotPass:'/user/verifyEmail',
    userResetPassword:'/user/resetPassword',
    resendOtp:'/user/resendOtp', 
    getProfile:'/user/getProfile',
    updateProfile:'/user/editProfile',
    addAddress:'/user/addAddress',
    getAddress:'/user/getAddress',
    deleteAddress:'/user/deleteAddress',
    editAddress:'/user/editAddress',
    changePassword:'/user/changePassword',
    getDepartments:'/user/getDepartments',
    getDoctors:'/user/getDoctors',
    getHospitals:'/user/getHospitals',
    getClinicks:'/user/getClinicks',
    getHomeNurses:'/user/getHomeNurses',
    getAmbulances:'/user/getAmbulances',
}

export default userRoutes ;
