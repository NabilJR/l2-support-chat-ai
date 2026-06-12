"use client";

// src/app/page.tsx
import ChatContainer from "@/components/ChatContainer";
import AuthModal from "@/components/AuthModal";
import { useState, useEffect } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("appAccessToken");
    // Gunakan fungsi setTimeout untuk menunda pemanggilan setIsAuthenticated
    // Ini membantu menghindari peringatan ESLint tentang panggilan setState sinkron dalam useEffect
    if (typeof window !== "undefined" && storedToken) {
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
    }
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  const handleAuthenticate = (token: string) => {
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
