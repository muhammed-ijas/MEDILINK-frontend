import { createSlice } from "@reduxjs/toolkit";

const getStoredSPInfo = () => {
    const storedSPInfo = localStorage.getItem('spInfo');
    try {
        return storedSPInfo ? JSON.parse(storedSPInfo) : null;
    } catch (error) {
        console.log('Error parsing stored sp info:', error);
        localStorage.removeItem('spInfo');
        return null;
    }
};

const initialState = {
    spInfo: getStoredSPInfo(),
};

const spSlice = createSlice({
    name: "sp",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.spInfo = action.payload; // Ensuring consistency
            localStorage.setItem('spInfo', JSON.stringify(action.payload));
        },
        spLogout: (state) => {
            state.spInfo = null; // Ensuring consistency
            localStorage.removeItem('spInfo');
        },
        clearSp: (state) => {
            state.spInfo = null; // Ensuring consistency
            localStorage.removeItem('spInfo');
        },
    }
});

export const { setCredentials, spLogout, clearSp } = spSlice.actions;
export default spSlice.reducer;
