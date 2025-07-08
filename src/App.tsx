import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { Container, Spinner } from 'react-bootstrap';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/auth/PrivateRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

// Lazy loading으로 성능 최적화
const Dashboard = lazy(() => import('./Routes/Dashboard'));
const Login = lazy(() => import('./Routes/Login'));
const Register = lazy(() => import('./Routes/Register'));
const Insertdata = lazy(() => import('./Routes/Insertdata'));
const TransactionDetail = lazy(() => import('./Routes/TransactionDetail'));
const LedgerBookName = lazy(() => import('./Routes/LedgerBookName'));
const Category = lazy(() => import('./Routes/Category'));
const MyPage = lazy(() => import('./Routes/MyPage'));
const OAuth = lazy(() => import('./components/OAuthAccessTokenProvider'));

// 로딩 컴포넌트
const LoadingFallback = () => (
  <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">로딩중...</span>
    </Spinner>
  </Container>
);

function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인 (필요시 구현)
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="App">
        <Navbar />
        
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" replace /> : <Register />
            } />
            <Route path="/OAuth" element={<OAuth />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/input" element={<Insertdata />} />
              <Route path="/details" element={<TransactionDetail />} />
              <Route path="/book" element={<LedgerBookName />} />
              <Route path="/category" element={<Category />} />
              <Route path="/mypage" element={<MyPage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={
              <Container className="text-center mt-5">
                <h2>404 - 페이지를 찾을 수 없습니다</h2>
                <p>요청하신 페이지가 존재하지 않습니다.</p>
                <a href="/">홈으로 돌아가기</a>
              </Container>
            } />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;