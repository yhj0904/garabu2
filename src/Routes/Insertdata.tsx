import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createTransaction, fetchCategories, fetchPayments } from '../store/transactionSlice';
import { TransactionType } from '../types';
import type { TransactionFormData } from '../types';

function Insertdata() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { username, bookNames } = useAppSelector(state => state.LoggedInMember);
  const { categories, payments, loading } = useAppSelector(state => state.transactionSlice);
  
  // 임시로 첫 번째 책을 선택된 책으로 사용
  const selectedBookName = bookNames[0] || '';
  const currentUser = { username };
  
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    spender: currentUser?.username || '',
    description: '',
    category: '',
    payment: '',
    memo: '',
    amountType: TransactionType.EXPENSE,
    bookName: selectedBookName,
  });
  
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 카테고리와 결제수단 목록 로드
    dispatch(fetchCategories());
    dispatch(fetchPayments());
  }, [dispatch]);

  useEffect(() => {
    // 선택된 가계부나 사용자 정보 업데이트
    setFormData(prev => ({
      ...prev,
      bookName: selectedBookName,
      spender: currentUser?.username || prev.spender,
    }));
  }, [selectedBookName, currentUser]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    if (!selectedBookName) {
      setError('가계부를 선택해주세요.');
      return;
    }

    try {
      await dispatch(createTransaction(formData)).unwrap();
      setSuccess(true);
      
      // 폼 초기화
      setFormData({
        ...formData,
        amount: 0,
        description: '',
        category: '',
        payment: '',
        memo: '',
        date: new Date().toISOString().slice(0, 10),
      });
      
      setTimeout(() => {
        navigate('/details');
      }, 1500);
    } catch (err: any) {
      setError(err.message || '거래 내역 저장에 실패했습니다.');
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        date: date.toISOString().slice(0, 10),
      });
    }
  };

  if (!selectedBookName) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>가계부를 선택해주세요</Alert.Heading>
          <p>대시보드에서 가계부를 먼저 선택한 후 거래를 입력할 수 있습니다.</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-warning" onClick={() => navigate('/')}>
              대시보드로 이동
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">거래 내역 입력</h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success">
                  거래 내역이 저장되었습니다. 잠시 후 거래 내역 페이지로 이동합니다.
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>가계부</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedBookName}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>작성자</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.spender}
                        readOnly
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>날짜</Form.Label>
                      <DatePicker
                        selected={new Date(formData.date)}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        maxDate={new Date()}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>금액</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          amount: Number(e.target.value)
                        })}
                        required
                        min="0"
                      />
                      <Form.Control.Feedback type="invalid">
                        금액을 입력해주세요.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>카테고리</Form.Label>
                      <Form.Select
                        value={formData.category}
                        onChange={(e) => setFormData({
                          ...formData,
                          category: e.target.value
                        })}
                        required
                      >
                        <option value="">선택하세요</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.category}>
                            {cat.category}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        카테고리를 선택해주세요.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>결제수단</Form.Label>
                      <Form.Select
                        value={formData.payment}
                        onChange={(e) => setFormData({
                          ...formData,
                          payment: e.target.value
                        })}
                        required
                      >
                        <option value="">선택하세요</option>
                        {payments.map(pay => (
                          <option key={pay.id} value={pay.payment}>
                            {pay.payment}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        결제수단을 선택해주세요.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>내용</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: e.target.value
                    })}
                    placeholder="거래 내용을 입력하세요"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    거래 내용을 입력해주세요.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>메모 (선택사항)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.memo}
                    onChange={(e) => setFormData({
                      ...formData,
                      memo: e.target.value
                    })}
                    placeholder="추가 메모사항을 입력하세요"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>거래 유형</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="지출"
                      name="amountType"
                      id="expense"
                      checked={formData.amountType === TransactionType.EXPENSE}
                      onChange={() => setFormData({
                        ...formData,
                        amountType: TransactionType.EXPENSE
                      })}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="수입"
                      name="amountType"
                      id="income"
                      checked={formData.amountType === TransactionType.INCOME}
                      onChange={() => setFormData({
                        ...formData,
                        amountType: TransactionType.INCOME
                      })}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="이체"
                      name="amountType"
                      id="transfer"
                      checked={formData.amountType === TransactionType.TRANSFER}
                      onChange={() => setFormData({
                        ...formData,
                        amountType: TransactionType.TRANSFER
                      })}
                    />
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading || success}
                  >
                    {loading ? '저장 중...' : '저장'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/')}
                  >
                    취소
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Insertdata;