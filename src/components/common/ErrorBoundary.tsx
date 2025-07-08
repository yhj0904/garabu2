import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>오류가 발생했습니다</Alert.Heading>
            <p>
              애플리케이션에서 예상치 못한 오류가 발생했습니다. 
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-danger" 
                onClick={() => window.location.reload()}
              >
                페이지 새로고침
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 