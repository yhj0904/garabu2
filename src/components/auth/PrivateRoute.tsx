import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const PrivateRoute = () => {
  const { user } = useAppSelector((state) => state.auth);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 인증된 사용자는 요청된 컴포넌트를 렌더링
  return <Outlet />;
};

export default PrivateRoute; 