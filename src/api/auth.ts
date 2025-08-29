export async function loginApi(email: string, password: string) {
  if (email === "test@example.com" && password === "123456") {
    return {
      token: "fake-jwt-token",
      user: { id: 1, email, name: "Test User" },
    };
  }
  throw new Error("Invalid credentials");
}
export async function registerApi(
  email: string,
  password: string,
  name: string
) {
  return {
    token: "fake-jwt-token",
    user: { id: 2, email, name },
  };
}

export async function meApi(token: string) {
  if (token === "fake-jwt-token") {
    return { id: 1, email: "test@example.com", name: "Test User" };
  }
  throw new Error("Invalid token");
}
