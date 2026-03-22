import { useState } from "react";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Trigger sonner toast via UI if passed in or just log for now
    console.log("Login submitted");
    
    setIsLoading(false);
  };

  return {
    handleLogin,
    isLoading,
  };
}
