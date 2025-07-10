import { apiService } from "@/services/mock/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const useAccountValidation = (accountNumber: string) => {
  const [debouncedAccountNumber, setDebouncedAccountNumber] = useState("");

  // Debounce the account number input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAccountNumber(accountNumber);
    }, 300);

    return () => clearTimeout(timer);
  }, [accountNumber]);

  return useQuery({
    queryKey: ["validateAccount", debouncedAccountNumber],
    queryFn: () => apiService.validateAccountNumber(debouncedAccountNumber),
    enabled: debouncedAccountNumber.length >= 10,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useAccountValidation;
