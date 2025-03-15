import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axiosInstance.post("/api/admin/products/add", formData);
    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axiosInstance.get("/api/admin/products/get");
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axiosInstance.put(
      `/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axiosInstance.delete(`/api/admin/products/delete/${id}`);
    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
