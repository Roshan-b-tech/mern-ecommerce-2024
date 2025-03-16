import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  addresses: [],
  isLoading: false,
};

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async ({ userId, addressData }) => {
    const response = await axiosInstance.post(
      "/api/shop/address/add",
      {
        userId,
        ...addressData,
      }
    );

    return response.data;
  }
);

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId) => {
    const response = await axiosInstance.get(
      `/api/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axiosInstance.delete(
      `/api/shop/address/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data;
      })
      .addCase(addAddress.rejected, (state) => {
        state.isLoading = false;
        state.addresses = [];
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data;
      })
      .addCase(fetchAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addresses = [];
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload.data;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        state.addresses = [];
      });
  },
});

export default addressSlice.reducer;
