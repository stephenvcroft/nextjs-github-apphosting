"use client";

import { useState } from "react";
import { getMessage } from "./actions";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true); // Set loading state
    try {
      const data = await getMessage();
      alert(data.message);
    } catch (error) {
      console.error("Error fetching message:", error);
    } finally {
      setIsLoading(false); // Reset loading state after the action
    }
  };

  return (
    <div>
      <h1>Welcome to the Next.js 14 App Router!</h1>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Click to Get Message"}
      </button>
    </div>
  );
};

export default Page;
