import { useEffect, useState } from "react";
import api from "../api/axios";
import { Container, Stack, Badge, Form, Button, Row, Col } from "react-bootstrap";

interface Category {
    id: number;
    category: string;
}

function CategoryDetail(params: any) {

    const [categoryName, setCategoryName] = useState('');
    const [resData, setResData] = useState<Category[]>([]);

    useEffect(() => {
        api.get('/api/v2/category/list', {
        }).then((e) => {
            setResData(e.data.categories)
        })
    }, [])

    const categoryhandleSaveChanges = async (e: any) => {
        e.preventDefault();
        api.post('/api/v2/category', {
            category: categoryName
        }).then((e) => {
           // alert(JSON.stringify(e.data))
            setCategoryName(''); // 입력 필드 초기화
            alert('추가되었습니다.')
        })
    }


    return (
        <><Container>
            <Form onSubmit={categoryhandleSaveChanges}>
                <Form.Control
                    type="text"
                    placeholder="카테고리 이름을 입력하세요"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)} />
                <Button type="submit">저장</Button>
            </Form>
        </Container>
            <Container>
                <Container fluid="md">
                    저장된 카테고리
                    <Row>
                        <Col><Stack direction="horizontal" gap={2}>
                            {resData.map((category) => (
                                <Badge bg="secondary">
                                    {category.category}
                                </Badge>
                            ))}
                        </Stack></Col>
                    </Row>
                </Container>
            </Container></>
    )
}

export default CategoryDetail;