import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/Auth';

const NavigationBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/GarabuLogo.png"
            alt="가라부 로고"
            height="30"
            className="d-inline-block align-top me-2"
          />
          가라부
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">대시보드</Nav.Link>
                <Nav.Link as={Link} to="/input">거래 입력</Nav.Link>
                <Nav.Link as={Link} to="/details">거래 내역</Nav.Link>
                <Nav.Link as={Link} to="/book">가계부 관리</Nav.Link>
                <Nav.Link as={Link} to="/category">카테고리</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link as={Link} to="/mypage">마이페이지</Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout}>
                  로그아웃
                </Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">로그인</Nav.Link>
              <Nav.Link as={Link} to="/register">회원가입</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 