import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

// 가계부별 카테고리 목록 가져오기
export const fetchCategories = createAsyncThunk(
  'transaction/fetchCategories',
  async (bookId: number) => {
    const response = await api.get(`/api/v2/category/book/${bookId}`);
    return response.data.categories;
  }
);

// 가계부별 결제수단 목록 가져오기
export const fetchPayments = createAsyncThunk(
  'transaction/fetchPayments',
  async (bookId: number) => {
    const response = await api.get(`/api/v2/payment/book/${bookId}`);
    return response.data.payments;
  }
);

// 거래 내역 생성
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (formData: TransactionFormData) => {
    // bookId를 추출하여 올바른 형식으로 변환
    const requestData = {
      date: formData.date,
      amount: formData.amount,
      description: formData.description,
      memo: formData.memo,
      amountType: formData.amountType,
      bookId: formData.bookId, // bookId 추가
      payment: formData.payment,
      category: formData.category,
      spender: formData.spender
    };
    
    const response = await api.post('/api/v2/ledger/ledgers', requestData);
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