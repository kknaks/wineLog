import { WineAnalysis } from '../mock/diary/mock';

export interface WineFormData {
  frontImage: string | null;
  backImage: string | null;
  name: string;
  origin: string;
  grape: string;
  year: string;
  type: 'red' | 'white' | '';
  description: string;
  analysisResult: WineAnalysis | null;
  taste?: {
    sweetness: number;
    acidity: number;
    tannin: number;
    body: number;
    alcohol: number;
  };
  aroma?: string[];
  pairings?: string[];
  rating?: number;
  review?: string;
  price?: string;
  purchaseLocation?: string;
  drinkDate?: string;
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
