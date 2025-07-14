// 사용자 관련 타입
export interface User {
    id: number;
    username: string;
    email: string;
    bookNames?: string[];
  }
  
  // 인증 관련 타입
  export interface AuthState {
    accessToken: string | null;
    refreshToken?: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    email: string;
  }
  
  // 가계부 관련 타입
  export interface Book {
    id: number;
    title: string;
    owner: User;
    userBooks: User[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  // 거래 관련 타입
  export const TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
    TRANSFER: 'TRANSFER'
  } as const;
  
  export type TransactionType = typeof TransactionType[keyof typeof TransactionType];
  
  export interface Transaction {
    id: number;
    date: string;
    amount: number;
    spender: string;
    description: string;
    category: string;
    payment: string;
    memo?: string;
    amountType: TransactionType;
    bookName: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface TransactionFormData {
    date: string;
    amount: number;
    spender: string;
    description: string;
    category: string;
    payment: string;
    memo?: string;
    amountType: TransactionType;
    bookName: string;
    bookId?: number; // 가계부 ID 추가
  }
  
  // 카테고리 & 결제수단 타입
  export interface Category {
    id: number;
    category: string;
  }
  
  export interface Payment {
    id: number;
    payment: string;
  }
  
  // API 응답 타입
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
  }
  
  export interface ApiError {
    message: string;
    status: number;
    code?: string;
  }