import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: number;
  date: string; // YYYY-MM-DD format
  amount: number; // 금액
  creater: string; // 작성자
  customer: string;
  category: string; // 분류(객체)
  asset: string; // 자산내용
  contents: string; // 내용
  amounttype: string; // 수입지출
}

type TransactionState = Transaction[];

const initialState: TransactionState = [{
  id: 1,
  date: '2020-12-23',
  amount: 20000,
  creater: 'me',
  customer: 'you',
  category: 'test',
  asset: 'card',
  contents: 'test',
  amounttype: '지출',
}];

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // 새로운 거래 정보를 배열에 추가하는 액션
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      state.push(action.payload);
    },
  },
});

export const { updateTransaction } = transactionSlice.actions;

export default transactionSlice
