"use client";

// src/app/page.tsx
import ChatContainer from "@/components/ChatContainer";
import AuthModal from "@/components/AuthModal";
import { useState, useEffect } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("appAccessToken");
    if (typeof window === "undefined" || !storedToken) return;

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: storedToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          sessionStorage.removeItem("appAccessToken");
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      })
      .catch(() => {
        sessionStorage.removeItem("appAccessToken");
        setIsAuthenticated(false);
      });
  }, []);

  const handleAuthenticate = async (token: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Token akses tidak valid.");
    }

    sessionStorage.setItem("appAccessToken", token);
    setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated && <AuthModal onAuthenticate={handleAuthenticate} />}
      {isAuthenticated && <ChatContainer />}
    </>
  );
}
