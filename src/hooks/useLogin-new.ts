import { useState } from "react";

export function useLoginNew() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login submitted");
    setIsLoading(false);
  };

  return {
    handleLogin,
    isLoading,
  };
}
