import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import spSlice from "./slices/spSlice";
import adminSlice from './slices/adminSlice'


const store = configureStore({
    reducer: {
        auth: authSlice,
        sp: spSlice,
        adminAuth:adminSlice,

    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
