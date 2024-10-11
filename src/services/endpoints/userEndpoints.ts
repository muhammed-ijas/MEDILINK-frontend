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
    getHospitalClinicDetails: '/user/getHospitalClinicDetails',
    getDepartmentDetails: '/user/getDepartmentDetails',

    getDoctorDetails: '/user/getDoctorDetails',
    getDoctorDetailsFromSearchPage: '/user/getDoctorDetailsFromSearchPage',

    getHomeNurseDetails: '/user/getHomeNurseDetails',
    getAmbulanceDetails: '/user/getAmbulanceDetails',

    createPaymentsession: '/user/createPaymentsession',
    updateStatus:'/user/updateBookingstatus',
    getFullAppointmentList:'/user/getFullAppointmentList',

    appointmentCancel:"/user/appointmentCancel",

    addReview:"/user/addReview",

    allUsersRoute:"/user/allUsersRoute",
    getMessageRoute:"/user/getMessageRoute",
    sendMessageRoute:"/user/sendMessageRoute",

    getEmergencyNumbers:"/user/getEmergencyNumbers",

    getWalletDetails:"/user/getWalletDetails",

    isWalletHaveMoney:"/user/isWalletHaveMoney",
    confirmWalletPayment:"/user/confirmWalletPayment",

}

export default userRoutes ;