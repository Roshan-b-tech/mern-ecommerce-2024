import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  isLoading: false,
  reviews: [],
  success: false,
  message: "",
  error: null
};

export const addReview = createAsyncThunk(
  "review/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/shop/review/add`,
        formdata
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        success: false,
        message: "Network error occurred"
      });
    }
  }
);

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/shop/review/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        success: false,
        message: "Network error occurred"
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.success = false;
      state.message = "";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.success = false;
        state.error = action.payload || { message: "Failed to fetch reviews" };
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        if (action.payload.data) {
          state.reviews = [...state.reviews, action.payload.data];
        }
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload || { message: "Failed to add review" };
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;