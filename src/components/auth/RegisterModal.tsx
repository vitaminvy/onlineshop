import { useState } from "react";
import { useAuth } from "@/store/auth";
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}
/**
 * RegisterModal
 * Input: isOpen(boolean), onClose (function)
 * Process: Render modal overlay resgistration form(name, email,password)
 *          On submit => call useAuth,register()to register user and auto-login
 *          if success => close modal , else show error
 * Output: A modal component that allow user to register and become logged-in
 */
export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Register failed");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Register
            </button>
            <button
              type="button"
              className="w-full bg-red-500 text-white py-2 rounded"
              onClick={onClose}
            >Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
