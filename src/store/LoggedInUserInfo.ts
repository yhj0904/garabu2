import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';

interface Book {
  id: number; // ID 필드 추가
  title: string;
  owner: {
    email: string;
    name:string;
    username: string;
  };
  userBooks: unknown[]; 
}

interface LoggedInUserInfoState {
  username: string;
  email: string;
  bookNames: string[];
  books: Book[]; // 전체 Book 객체 배열 추가
  loading: boolean;
  error: string | null;
}

const initialState: LoggedInUserInfoState = {
  username: '',
  email: '',
  bookNames: [],
  books: [], // books 배열 초기화
  loading: false,
  error: null,
};

// Async thunk for fetching user data
export const fetchMemberTransaction = createAsyncThunk<Book[]>(
  'transaction/fetchMemberTransaction',
  async () => {
    const response = await api.get<Book[]>('/api/v2/book/mybooks');
    return response.data;
  }
);

const memberTransactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addBookName: (state, action: PayloadAction<string>) => {
      state.bookNames.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemberTransaction.fulfilled, (state, action) => {
        // 첫 번째 책의 소유자 정보를 사용자 정보로 사용
        state.username = action.payload[0].owner.username;
        state.email = action.payload[0].owner.email;
        state.bookNames = action.payload.map(book => book.title);
        state.books = action.payload; // 전체 Book 객체 저장
        state.loading = false;
      })
      .addCase(fetchMemberTransaction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch data';
        state.loading = false;
      });
  }
});

export const { addBookName } = memberTransactionSlice.actions;
export default memberTransactionSlice;
