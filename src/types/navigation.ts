export type AppRoute = "/" | "/admin" | "/manager" | "/login";

export interface UserData {
  role: "admin" | "manager" | "cashier";
  username: string;
  // add other user properties as needed
}

export interface LoginResponse {
  access_token: string;
  user: UserData;
}
