import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';

interface Book {
  title: string;
  owner: {
    email: string;
    name:string;
    username: string;
  };
  userBooks: any[]; 
}

interface LoggedInUserInfoState {
  username: string;
  email: string;
  bookNames: string[];
  loading: boolean;
  error: string | null;
}

const initialState: LoggedInUserInfoState = {
  username: '',
  email: '',
  bookNames: [],
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
