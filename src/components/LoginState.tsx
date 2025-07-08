import React, { useEffect,useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { loginSuccess }             from '../store/LoginStatusSlice';
function LoginStatus() {

    const [cookies] = useCookies(['refresh']);
    const dispatch = useDispatch();

    //refresh 토큰은 httpOnly라서 클라이언트에선 접근 불가
    
    useEffect(() => {
       console.log("로그인 판별기 ...")
        // const refreshToken = cookies.refresh;
        // console.log('쿠키에서 가져온 refreshToken:', refreshToken);


        // 로컬 스토리지에서 'access' 토큰 확인
        const hasAccessToken = !!localStorage.getItem('accessToken');

        // 두 조건 모두 충족하면 로그인됨
        if (hasAccessToken) {
            console.log("로그인 되어있습니다.");
            dispatch(loginSuccess({ accessToken: hasAccessToken}))
        }
        else if(!hasAccessToken){
            console.log(" 로그인 안돼있음 ");
        }
    }, []);

    return null; // UI 렌더링이 필요 없을 때 null 반환
}

export default LoginStatus;
