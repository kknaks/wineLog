import { WineAnalysis } from '../mock/diary/mock';
import { WineData } from './wine';

export interface DiaryFormData {
  id?: number;
  wineData: WineData;
  thumbnailImage: string | null;
  downloadImage: string | null;
  drinkDate?: string;
  rating?: number;
  review?: string;
  price?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean;
}
