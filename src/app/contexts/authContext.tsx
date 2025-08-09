"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  accountId: number;
  isSignedIn: boolean;
  signIn: (accountId: number) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<number>(-1);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("account_id");
    if (stored) {
      const id = Number(stored);
      if (!isNaN(id)) {
        setAccountId(id);
        setIsSignedIn(true);
      }
    }
  }, []);

  const signIn = (id: number) => {
    sessionStorage.setItem("account_id", id.toString());
    setAccountId(id);
    setIsSignedIn(true);
  };

  const signOut = () => {
    sessionStorage.removeItem("account_id");
    setAccountId(-1);
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ accountId, isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};