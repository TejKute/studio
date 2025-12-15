export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO string or Firestore Timestamp
  previewImageUrl: string;
  imageHint: string;
};
