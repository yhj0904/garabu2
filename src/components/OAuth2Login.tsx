import React from 'react';
import naverImg from '../img/btnG_아이콘원형.png'
function OAuth2Login() {
  // 이미지 클릭 이벤트 핸들러
  const onNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    // 여기서 클릭 이벤트에 대한 다른 로직을 추가할 수 있습니다.
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
    
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
    <img
      src="https://developers.google.com/static/identity/images/g-logo.png?hl=ko"
      alt="Google Login"
      onClick={onGoogleLogin}
      style={{ cursor: 'pointer', width: '50px', height: '50px' }}
    />
    <img
      src={naverImg}
      alt="Naver Login"
      onClick={onNaverLogin}
      style={{ cursor: 'pointer', width: '50px', height: '50px' }}
    />
    
  </div>
  );
}

export default OAuth2Login;
