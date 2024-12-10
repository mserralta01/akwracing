import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface GeneralSettings {
  timezone: string;
  // ... other settings
}

export const settingsService = {
  async getGeneralSettings(): Promise<GeneralSettings> {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    return docSnap.data() as GeneralSettings || { timezone: 'America/New_York' };
  },

  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<void> {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, settings, { merge: true });
  }
}; 