import { User, signInWithPopup, GoogleAuthProvider, Auth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(auth: Auth): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    return null;
  }
}

export async function isAdminUser(user: User): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    return userDoc.exists() && userDoc.data()?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
} 