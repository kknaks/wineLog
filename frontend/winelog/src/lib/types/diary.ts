import { WineAnalysis } from '../mock/diary/mock';

export interface WineFormData {
  frontImage: string | null;
  backImage: string | null;
  thumbnailImage: string | null;
  name: string;
  origin: string;
  grape: string;
  year: string;
  type: 'red' | 'white' | '';
  description: string;
  analysisResult: {
    name: string;
    grape: string;
    origin: string;
    year: string;
    type: 'red' | 'white' | '';
    description: string;
  } | null;
  pairings: string[];
  aromaNote: string;
  tasteNote: string;
  finishNote: string;
  drinkDate?: string;
  taste: {
    sweetness: number;
    acidity: number;
    tannin: number;
    body: number;
    alcohol: number;
  };
  aroma?: string[];
  pairingImage?: string | null;
  rating?: number;
  review?: string;
  price?: string;
  purchaseLocation?: string;
  id?: string;
  createdAt?: Date;
}

export interface WineDiary extends WineAnalysis {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  images?: {
    front?: string;
    back?: string;
  };
}

export type WineType = 'red' | 'white' | 'rose' | 'sparkling';
