import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Service for managing legal documents like Terms and Conditions and Privacy Policy
 */
export const legalService = {
  /**
   * Save terms and conditions content
   * @param content HTML content of terms and conditions
   * @returns Promise that resolves when operation completes
   */
  async saveTermsAndConditions(content: string): Promise<void> {
    const docRef = doc(db, 'legal', 'termsAndConditions');
    await setDoc(docRef, {
      content,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Save privacy policy content
   * @param content HTML content of privacy policy
   * @returns Promise that resolves when operation completes
   */
  async savePrivacyPolicy(content: string): Promise<void> {
    const docRef = doc(db, 'legal', 'privacyPolicy');
    await setDoc(docRef, {
      content,
      updatedAt: new Date().toISOString()
    });
  },

  /**
   * Get terms and conditions content
   * @returns Promise with content or empty string if not found
   */
  async getTermsAndConditions(): Promise<string> {
    const docRef = doc(db, 'legal', 'termsAndConditions');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().content;
    }
    
    return '';
  },

  /**
   * Get privacy policy content
   * @returns Promise with content or empty string if not found
   */
  async getPrivacyPolicy(): Promise<string> {
    const docRef = doc(db, 'legal', 'privacyPolicy');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().content;
    }
    
    return '';
  }
}; 