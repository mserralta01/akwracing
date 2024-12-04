import { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  id: string;
} 