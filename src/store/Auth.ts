import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
    user: null
};

// createSlice를 사용하여 슬라이스 생성
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // 로그인 액션; PayloadAction을 사용하여 payload 타입 정의
        loginSuccess(state, action: PayloadAction<any>) {
            state.user = action.payload;
        },
        // 로그아웃 액션
        logout(state) {
            state.user = null;
        }
    }
});

// 생성된 액션 크리에이터와 리듀서의 내보내기
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
