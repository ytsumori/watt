import { useState } from "react";

export function useReservation() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = ({ onSuccess }: { onSuccess: () => void }) => {
    setIsLoading(true);
    setTimeout(() => {
      onSuccess();
      setIsLoading(false);
    }, 3000);
  };

  return {
    isLoading,
    mutate,
  };
}
