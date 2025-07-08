import { Row, Col, Card, Spinner } from 'react-bootstrap';
import type { Transaction } from '../types';
import { TransactionType } from '../types';
import styled from 'styled-components';

interface TransactionSummaryProps {
  transactions: Transaction[];
  loading: boolean;
}

const SummaryCard = styled(Card)`
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const Amount = styled.h3<{ type: 'income' | 'expense' | 'balance' }>`
  color: ${props => 
    props.type === 'income' ? '#2e7d32' : 
    props.type === 'expense' ? '#d32f2f' : 
    '#1976d2'
  };
  margin: 10px 0;
`;

function TransactionSummary({ transactions, loading }: TransactionSummaryProps) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">로딩중...</span>
        </Spinner>
      </div>
    );
  }

  // 이번 달 거래만 필터링
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  // 수입/지출 계산
  const totalIncome = monthlyTransactions
    .filter(t => t.amountType === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter(t => t.amountType === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 카테고리별 지출 계산
  const categoryExpenses = monthlyTransactions
    .filter(t => t.amountType === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // 상위 5개 카테고리
  const topCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <SummaryCard>
            <Card.Body>
              <Card.Title>이번 달 수입</Card.Title>
              <Amount type="income">
                +{totalIncome.toLocaleString()}원
              </Amount>
            </Card.Body>
          </SummaryCard>
        </Col>
        <Col md={4}>
          <SummaryCard>
            <Card.Body>
              <Card.Title>이번 달 지출</Card.Title>
              <Amount type="expense">
                -{totalExpense.toLocaleString()}원
              </Amount>
            </Card.Body>
          </SummaryCard>
        </Col>
        <Col md={4}>
          <SummaryCard>
            <Card.Body>
              <Card.Title>잔액</Card.Title>
              <Amount type="balance">
                {balance.toLocaleString()}원
              </Amount>
            </Card.Body>
          </SummaryCard>
        </Col>
      </Row>

      {topCategories.length > 0 && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>카테고리별 지출 TOP 5</Card.Title>
                {topCategories.map(([category, amount]) => (
                  <div key={category} className="d-flex justify-content-between py-2 border-bottom">
                    <span>{category}</span>
                    <span className="text-danger">
                      -{amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default TransactionSummary;