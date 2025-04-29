import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

// Helper to create SEO-friendly filenames
const createSEOFilename = (originalFilename: string, section: string): string => {
  // Get the file extension
  const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Create a base name from the section, removing special chars and replacing spaces with hyphens
  const baseName = section
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  // Add a timestamp to ensure uniqueness
  const timestamp = new Date().getTime();
  
  return `${baseName}-image-${timestamp}.${extension}`;
};

export const storageService = {
  /**
   * Upload an image to Firebase Storage and return the public URL
   * @param file The file to upload
   * @param section The website section this image belongs to (for SEO filename)
   * @returns Promise with the download URL
   */
  async uploadWebsiteImage(file: File, section: string): Promise<string> {
    try {
      const filename = createSEOFilename(file.name, section);
      const storageRef = ref(storage, `website/${filename}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get and return the public URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading website image:", error);
      throw new Error("Failed to upload image. Please try again.");
    }
  }
}; 