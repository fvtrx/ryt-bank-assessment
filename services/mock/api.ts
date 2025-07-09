import { ApiResponse, Contact, Transaction, TransferRequest } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  async validateAccountNumber(
    accountNumber: string
  ): Promise<ApiResponse<{ name: string; bank: string }>> {
    await delay(1000);

    // Simulate mock accountholders
    const mockAccounts: Record<string, { name: string; bank: string }> = {
      "9876543210": { name: "Sarah Lee", bank: "Maybank" },
      "5555666677": { name: "Ali Hassan", bank: "CIMB Bank" },
      "1111222233": { name: "Siti Aminah", bank: "Public Bank" },
      "4444555566": { name: "David Tan", bank: "Hong Leong Bank" },
    };

    const account = mockAccounts[accountNumber];

    if (account) {
      return {
        success: true,
        data: account,
      };
    }

    return {
      success: false,
      error: "Account number not found",
    };
  }

  async processTransfer(
    transferData: TransferRequest
  ): Promise<ApiResponse<Transaction>> {
    await delay(2000);

    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: "Network error occurred. Please try again.",
      };
    }

    // Simulate insufficient funds check
    if (transferData.amount > 10000) {
      return {
        success: false,
        error: "Insufficient funds for this transaction",
      };
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      recipientName: transferData.recipientName,
      recipientAccountNumber: transferData.recipientAccountNumber,
      amount: transferData.amount,
      note: transferData.note,
      timestamp: new Date(),
      status: "completed",
      type: "transfer",
      bank: transferData.bank,
    };

    return {
      success: true,
      data: transaction,
    };
  }

  async getTransactionHistory(): Promise<ApiResponse<Transaction[]>> {
    await delay(500);

    // This would normally fetch from a backend
    return {
      success: true,
      data: [],
    };
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    await delay(300);

    // Simulate contact list
    const contacts: Contact[] = [
      {
        id: "1",
        name: "Sarah Lee",
        accountNumber: "9876543210",
        bank: "Maybank",
        isFrequent: true,
      },
      {
        id: "2",
        name: "Ali Hassan",
        accountNumber: "5555666677",
        bank: "CIMB Bank",
        isFrequent: true,
      },
      {
        id: "3",
        name: "Siti Aminah",
        accountNumber: "1111222233",
        bank: "Public Bank",
      },
      {
        id: "4",
        name: "David Tan",
        accountNumber: "4444555566",
        bank: "Hong Leong Bank",
      },
    ];

    return {
      success: true,
      data: contacts,
    };
  }
}

export const apiService = new ApiService();
