import { User, signInWithPopup, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();
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

export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  return userDoc.exists() && userDoc.data().role === "admin";
} 