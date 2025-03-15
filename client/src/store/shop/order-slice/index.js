import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createOrder = createAsyncThunk(
  "/order/createOrder",
  async (orderData) => {
    const response = await axiosInstance.post("/api/shop/order/create", orderData);
    return response.data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "/order/fetchAllOrders",
  async (userId) => {
    const response = await axiosInstance.get(`/api/shop/order/get/${userId}`);
    return response.data;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "/order/fetchOrderDetails",
  async ({ userId, orderId }) => {
    const response = await axiosInstance.get(
      `/api/shop/order/get-details/${userId}/${orderId}`
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ userId, orderId, orderStatus }) => {
    const response = await axiosInstance.put(
      `/api/shop/order/update-status/${userId}/${orderId}`,
      { orderStatus }
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = [...state.orderList, action.payload.data];
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(fetchOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        state.orderList = state.orderList.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
