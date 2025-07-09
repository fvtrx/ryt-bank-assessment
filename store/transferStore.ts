import { Contact, Transaction, TransferRequest } from "@/types";
import { create } from "zustand";

interface TransferState {
  currentTransfer: Partial<TransferRequest> | null;
  recentTransactions: Transaction[];
  favoriteContacts: Contact[];
  isProcessing: boolean;
  error: string | null;
  setTransferData: (data: Partial<TransferRequest>) => void;
  clearTransfer: () => void;
  addTransaction: (transaction: Transaction) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  addFavoriteContact: (contact: Contact) => void;
}

const useTransferStore = create<TransferState>((set) => ({
  currentTransfer: null,
  recentTransactions: [
    {
      id: "1",
      recipientName: "Sarah Lee",
      recipientAccountNumber: "9876543210",
      amount: 250.0,
      note: "Lunch payment",
      timestamp: new Date("2024-01-15T10:30:00"),
      status: "completed",
      type: "transfer",
      bank: "Maybank",
    },
    {
      id: "2",
      recipientName: "Ali Hassan",
      recipientAccountNumber: "5555666677",
      amount: 500.0,
      note: "Rent payment",
      timestamp: new Date("2024-01-14T14:20:00"),
      status: "completed",
      type: "transfer",
      bank: "CIMB Bank",
    },
  ],
  favoriteContacts: [
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
      isFrequent: false,
    },
  ],
  isProcessing: false,
  error: null,
  setTransferData: (data) =>
    set((state) => ({
      currentTransfer: { ...state.currentTransfer, ...data },
    })),
  clearTransfer: () => set({ currentTransfer: null, error: null }),
  addTransaction: (transaction) =>
    set((state) => ({
      recentTransactions: [transaction, ...state.recentTransactions],
    })),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setError: (error) => set({ error }),
  addFavoriteContact: (contact) =>
    set((state) => ({
      favoriteContacts: [...state.favoriteContacts, contact],
    })),
}));

export default useTransferStore;
