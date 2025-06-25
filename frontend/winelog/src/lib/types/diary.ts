import { WineAnalysis } from '../mock/diary/mock';
import { WineData } from './wine';

export interface DiaryFormData {
  id?: number;
  wineData: WineData;
  frontImage?: string | null;
  backImage?: string | null;
  thumbnailImage?: string | null;
  downloadImage?: string | null;
  frontImageFile?: File | null;
  backImageFile?: File | null;
  thumbnailImageFile?: File | null;
  downloadImageFile?: File | null;
  drinkDate?: string;
  rating?: number;
  review?: string;
  price?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic?: boolean;
}
