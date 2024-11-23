import { User } from "firebase/auth";

export function isAdminUser(user: User | null): boolean {
  return user?.email === "mserralta@gmail.com";
} 