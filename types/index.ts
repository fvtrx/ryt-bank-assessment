export interface User {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  email: string;
  phone: string;
}

export interface Contact {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
  isFrequent?: boolean;
}

export interface TransferRequest {
  recipientId: string;
  recipientName: string;
  recipientAccountNumber: string;
  amount: number;
  note?: string;
  bank: string;
  transferType: "duitnow" | "interbank";
}

export interface Transaction {
  id: string;
  recipientName: string;
  recipientAccountNumber: string;
  amount: number;
  note?: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  type: "transfer" | "receive";
  bank: string;
  transferType: "duitnow" | "interbank";
}

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: "fingerprint" | "face" | "iris";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
