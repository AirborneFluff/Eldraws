export function categorizeMimeType(mimeType: string): 'video' | 'image' | null {
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  return null;
}