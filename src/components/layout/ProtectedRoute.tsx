// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { client } = useAuth();
  if (!client) return <Navigate to="/" replace />;
  return children;
}