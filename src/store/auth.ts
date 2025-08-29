import { create } from "zustand";
import { loginApi, registerApi, meApi } from "@/api/auth";
type User = { id: number; email: string; name: string };

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  /**
   * Input: email, password (user credentials)
   * Process:
   *  - Call loginApi to get { token, user }
   *  - Save token into localStorage
   *  - Update state with user and token
   * Output: user is logged in and token is stored
   */
  login: async (email, password) => {
    const res = await loginApi(email, password);
    localStorage.setItem("token", res.token);
    set({ user: res.user, token: res.token });
  },
  /**
   * Input: email, password, name (registration data)
   * Process:
   *  - Call registerApi to create a new user
   *  - Save token into localStorage
   *  - Update state with user and token
   * Output: new user is registered and logged in immediately
   */

  register: async (email, password, name) => {
    const res = await registerApi(email, password, name);
    localStorage.setItem("token", res.token);
    set({ user: res.user, token: res.token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  fetchUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const user = await meApi(token);
      set({ user });
    } catch {
      set({ user: null, token: null });
    }
  },
}));
