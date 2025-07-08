import { Container, Row, Col, Alert, Accordion,ListGroup } from "react-bootstrap";
import CalendarPage from "./CalendarPage";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchMemberTransaction } from '../store/LoggedInUserInfo'


function Dashboard() {

    const LoggedInInfo = useSelector((state: RootState) => state.LoggedInMember);

    const [error, setError] = useState('');
    // 선택된 bookName의 상태를 관리합니다. 초기값은 null이거나 첫 번째 bookName의 인덱스(있는 경우)
    const [selectedBookName, setSelectedBookName] = useState(LoggedInInfo.bookNames.length > 0 ? LoggedInInfo.bookNames[0] : '');

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
           

        dispatch(fetchMemberTransaction())
        .then(() => {
         
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                setError('Please log in to continue.');
            } else if (error.response && error.response.status >= 401) {
                setError('An error occurred. Please try again later.');
            }
        })
          
    }, []);

    const handleSelectBookName = (bookName: string) => {
        setSelectedBookName(bookName);
        console.log(bookName); // Logging the book name directly
    };

    return (

        <Container>
            {error && <Alert variant="danger">{error}</Alert>}

            <div>
                <Container>
                <Accordion >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>{selectedBookName}</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup>
                                        {LoggedInInfo.bookNames.map((bookName: string, index: number) => (
                                            <ListGroup.Item
                                                key={index}
                                                action
                                                variant="secondary"
                                                onClick={() => handleSelectBookName(bookName)}
                                                active={selectedBookName === bookName}
                                            >
                                                {bookName}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                           
                </Container>
            </div>

            <Row>
                <Col><CalendarPage /></Col>
            </Row>

            <div>
                <h3> Dashboard</h3>
            </div>
            <Row>
                <Col>분류별 지출 그래프</Col>
                <Col>결제 방식별 지출 (수입, 지출)</Col>
            </Row>
            <Row>
                <Col>예산 소진율</Col>
                <Col>현재하루지출</Col>
                <Col>주간 지출 추이</Col>
            </Row>
        </Container>
    )
}

export default Dashboard;


/*api.get('/user/me')
.then((res:any) => {
    console.log(res);
    setEmail(res.data.email);
    setUserName(res.data.username);
    dispatch(updateMemberTransaction({ 
        username: res.data.username, 
        email: res.data.email,
        error: '' // 에러 메시지 초기화
    }));
}) .catch((error) => {
    if (error.response && error.response.status === 401) {
        setError('Please log in to continue.');
    } else {
        setError('An error occurred. Please try again later.');
    }
});

api.get('/api/v2/book/mybooks')
.then((res:any)=>{
    console.log(res.data)
})*/