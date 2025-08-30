/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useAuth } from "@/store/auth";

/**
 * RegisterModal
 * Input: isOpen (boolean), onClose (function), onSwitchToLogin (function)
 * Process: Render modal overlay registration form (name, email, password).
 *          On submit => call useAuth.register() to register user and auto-login.
 *          If success => close modal, else show error.
 * Output: A modal component that allows user to register and become logged-in.
 */
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();

  // Early return: Modal not open
  if (!isOpen) return null;

  /**
   * handleSubmit
   * Input: React.FormEvent
   * Process: Prevent default, call register, handle success/error
   * Output: Registers user, closes modal on success, shows alert on failure
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Register user, auto-login on success
      await register(email, password, name);
      onClose();
    } catch (err) {
      // Show error if registration fails
      alert("Register failed");
    }
  };

  // UI: Modal overlay and 2-column card (matches LoginModal style)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Card container, 2-column grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-lg bg-white shadow-lg ring-1 ring-blue-200 overflow-hidden">
        {/* Left: Illustration */}
        <div className="hidden md:block">
          <img
            src="/images/register_img.jpg"
            alt="Register illustration"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right: Register form */}
        <div className="flex flex-col justify-center p-8">
          {/* Modal Title */}
          <img src="/images/logo.jpg" alt="Logo" className="w-14 h-14 mb-2 rounded-full mx-auto" />

          <h2 className="mb-6 text-2xl font-bold text-center">Welcome to my shop</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2">
              {/* Register button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
              >
                Register
              </button>
              {/* Cancel button */}
              <button
                type="button"
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md font-semibold transition"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
          {/* Switch to Login link */}
          <div className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium bg-transparent border-none"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
