import { Container,Form,Stack,Badge, Button,Row,Col } from "react-bootstrap";
import api from "../../api/axios";
import { useEffect, useState } from "react";

interface Payment {
    id : number;
    payment : string;
}

function PaymentDetail() {
    
    const [paymentName, setPaymentName] = useState('');
    const [resDatas, setResDatas] = useState<Payment[]>([]);

    useEffect(() => {
        api.get('/api/v2/payment/list', {
        }).then((response) => {
            setResDatas(response.data.payments)
        })
    }, [])

    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        api.post('/api/v2/payment', {
            payment: paymentName
        }).then(() => {
        //   alert(JSON.stringify(response.data))
        setPaymentName(''); // 입력 필드 초기화
            alert('추가되었습니다.')
        })
    }
    
    return(
        <><Container>
        <Form onSubmit={handleSaveChanges}>
            <Form.Control
                type="text"
                placeholder="결제수단 이름을 입력하세요"
                value={paymentName}
                onChange={(e) => setPaymentName(e.target.value)} />
            <Button type="submit">저장</Button>
        </Form>
    </Container>
        <Container>
            <Container fluid="md">
                저장된 결제수단
                <Row>
                    <Col><Stack direction="horizontal" gap={2}>
                        {resDatas.map((payment) => (
                            <Badge bg="secondary">
                                {payment.payment}
                            </Badge>
                        ))}
                    </Stack></Col>
                </Row>
            </Container>
        </Container></>
    )
}

export default PaymentDetail;