import { createSlice } from "@reduxjs/toolkit";
import { getMyClinicByIdApi } from "../../Utils/services/apis/Doctor/ClinicDoctorApi"; // Adjust the import path as needed

const initialState = {
  clinicDetails: null,
};

// Create slice
const getMyClinicByIdSlice = createSlice({
  name: "getMyClinicById",
  initialState,
  reducers: {
    setClinicDetails(state, action) {
      state.clinicDetails = action.payload;
    },
    resetClinicDetails(state) {
      state.clinicDetails = null; // Set clinicDetails to null
    },
  },
});

// Thunk to fetch clinic details by ID
export const fetchMyClinicById = (id) => async (dispatch) => {
  try {
    const data = await getMyClinicByIdApi(id);
    dispatch(setClinicDetails(data)); 
  } catch (error) {
    console.error("Error fetching clinic details:", error);
    // Optionally handle error state here
  }
};

export const { setClinicDetails, resetClinicDetails } = getMyClinicByIdSlice.actions; // Export reset action
export default getMyClinicByIdSlice.reducer;
