import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/review/addReview",
  async (formdata) => {
    const response = await axiosInstance.post(`/api/shop/review/add`, formdata);
    return response.data;
  }
);

export const getProductReviews = createAsyncThunk(
  "/review/getProductReviews",
  async (productId) => {
    const response = await axiosInstance.get(`/api/shop/review/get/${productId}`);
    return response.data;
  }
);

// Alias for backward compatibility
export const getReviews = getProductReviews;

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
