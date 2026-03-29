export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    university?: string;
    course?: string;
    student_id?: string;
    country?: string;
    arrival_date?: string;
    phone?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
  description: string;
}

export type ThemeId = 'light' | 'dark' | 'chocolate' | 'pink';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  SignUp: undefined;
  AuthCallback: undefined;
  Admin: undefined;
};
