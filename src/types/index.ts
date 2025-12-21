export type Project = {
  id: string;
  userId?: string;
  name: string;
  projectType?: string;
  description: string;
  theme?: string;
  createdAt: string; // ISO string or Firestore Timestamp
  updatedAt?: string;
  previewImageUrl?: string;
  imageHint?: string;
};
