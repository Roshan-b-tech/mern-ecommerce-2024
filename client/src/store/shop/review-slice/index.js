import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  isLoading: false,
  reviews: [],
  success: false,
  message: "",
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const response = await axiosInstance.post(
      `/api/shop/review/add`,
      formdata
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axiosInstance.get(
    `/api/shop/review/${id}`
  );

  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.success = false;
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.success = action.payload.success;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
        state.success = false;
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.data) {
          state.reviews = [...state.reviews, action.payload.data];
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.isLoading = false;
        state.success = false;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;