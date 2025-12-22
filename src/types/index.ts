import type { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  userId?: string;
  name: string;
  projectType?: string;
  description: string;
  theme?: string;
  createdAt: string | Timestamp; // Can be string or Firestore Timestamp
  updatedAt?: string;
  previewImageUrl?: string;
  imageHint?: string;
};
