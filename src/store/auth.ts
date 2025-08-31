import { create } from "zustand";
import { loginApi, registerApi } from "@/api/auth";
import { Client } from "@/type/user";

export async function meApi(token: string): Promise<Client> {
  /**
   * Input: token
   * Process: verify token; if valid, return the current client profile
   * Output: Client
   */
  if (token === "fake-jwt-token") {
    return {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      avatar: undefined,
      phone: "0900000000",
      address: "HCMC",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
  }
  throw new Error("Invalid token");
}

interface AuthState {
  client?: Client;
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  client: undefined,
  token: undefined,
  login: async (email: string, password: string) => {
    const { token } = await loginApi(email, password);
    set({ token });
    await get().fetchUser();
  },
  register: async (email: string, password: string, name: string) => {
    const { token } = await registerApi(email, password, name);
    set({ token });
    await get().fetchUser();
  },
  logout: () => {
    set({ client: undefined, token: undefined });
  },
  fetchUser: async () => {
    const token = get().token;
    if (!token) {
      set({ client: undefined });
      return;
    }
    try {
      const client = await meApi(token);
      set({ client });
    } catch {
      set({ client: undefined, token: undefined });
    }
  },
}));
