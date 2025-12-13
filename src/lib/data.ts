import type { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Socialite',
    description: 'A social media app for connecting with friends and sharing updates.',
    createdAt: '2024-07-21T10:00:00Z',
    previewImageUrl: 'https://picsum.photos/seed/101/600/400',
    imageHint: 'app interface',
  },
  {
    id: '2',
    name: 'FitTrack',
    description: 'A fitness tracking app to monitor workouts and progress.',
    createdAt: '2024-07-20T14:30:00Z',
    previewImageUrl: 'https://picsum.photos/seed/102/600/400',
    imageHint: 'dashboard fitness',
  },
  {
    id: '3',
    name: 'ShopSphere',
    description: 'An e-commerce platform for selling and buying products online.',
    createdAt: '2024-07-19T09:00:00Z',
    previewImageUrl: 'https://picsum.photos/seed/103/600/400',
    imageHint: 'ecommerce products',
  },
  {
    id: '4',
    name: 'TuneWave',
    description: 'A music streaming service with curated playlists and radio.',
    createdAt: '2024-07-18T18:00:00Z',
    previewImageUrl: 'https://picsum.photos/seed/104/600/400',
    imageHint: 'music player',
  },
  {
    id: '5',
    name: 'Wanderlust',
    description: 'A travel booking application for flights, hotels, and tours.',
    createdAt: '2024-07-17T11:45:00Z',
    previewImageUrl: 'https://picsum.photos/seed/105/600/400',
    imageHint: 'travel app',
  },
  {
    id: '6',
    name: 'FinSavvy',
    description: 'A personal finance manager to track expenses and budgets.',
    createdAt: '2024-07-16T20:15:00Z',
    previewImageUrl: 'https://picsum.photos/seed/106/600/400',
    imageHint: 'finance chart',
  },
];
