import { useState } from "react";
import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  // State to hold form input values

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Get login action from auth store

  const { login } = useAuth();
  // Hook for navigation after successful login

  const navigate = useNavigate();
  /**
   * Handle form submission
   * Input: form event (React.FormEvent)
   * Process:
   *  - Prevent default form submission behavior
   *  - Call login(email, password) from store
   *  - If success → redirect to homepage
   *  - If failure → show error message
   * Output: user logged in or error displayed
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/"); // redirect về homepage
    } catch (err) {
      alert("Login failed: " + (err as Error).message);
    }
  };
  /**
   * Render login page
   * Includes:
   *  - Input field for email
   *  - Input field for password
   *  - Submit button
   * Form is wrapped with handleSubmit for login process
   */

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
