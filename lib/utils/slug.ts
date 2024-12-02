export function generateCourseSlug(courseName: string, location: string, id?: string): string {
  const baseSlug = `${courseName}-${location}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  if (id) {
    // Take first 6 characters of the ID to make it shorter but still unique
    return `${baseSlug}-${id.slice(0, 6)}`;
  }
  
  return baseSlug;
} 