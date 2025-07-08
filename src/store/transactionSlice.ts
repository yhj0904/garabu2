import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TransactionFormData } from '../types';
import api from '../api/axios';

interface Category {
  id: number;
  category: string;
}

interface Payment {
  id: number;
  payment: string;
}

interface TransactionState {
  categories: Category[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  categories: [],
  payments: [],
  loading: false,
  error: null,
};

// 카테고리 목록 가져오기
export const fetchCategories = createAsyncThunk(
  'transaction/fetchCategories',
  async () => {
    const response = await api.get('/categories');
    return response.data;
  }
);

// 결제수단 목록 가져오기
export const fetchPayments = createAsyncThunk(
  'transaction/fetchPayments',
  async () => {
    const response = await api.get('/payments');
    return response.data;
  }
);

// 거래 내역 생성
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (formData: TransactionFormData) => {
    const response = await api.post('/transactions', formData);
    return response.data;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '카테고리 로드에 실패했습니다.';
      })
      // fetchPayments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '결제수단 로드에 실패했습니다.';
      })
      // createTransaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '거래 내역 저장에 실패했습니다.';
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer; 