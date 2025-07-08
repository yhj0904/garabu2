import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface LoginMember {
    username : string;
    email : string;
    error:string;
  }

  type LoginMemberState = LoginMember;

  const initialState: LoginMemberState = {
    username: '',
    email: '',
    error:'',

  };

  const MemberTransactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
      // 새로운 거래 정보를 배열에 추가하는 액션
      updateMemberTransaction: (state, action: PayloadAction<LoginMember>) => {
      state.username = action.payload.username;
      console.log(action.payload.username)
      console.log("이름저장")
      
      state.email = action.payload.email;
      state.error = action.payload.error;
      },
    },
  });

  export const { updateMemberTransaction } = MemberTransactionSlice.actions;

export default MemberTransactionSlice;
