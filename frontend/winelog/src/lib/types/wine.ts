export interface WineData{
  id: number;
  name: string;
  origin: string;
  grape: string;
  year: string;
  alcohol: string;
  type: 'red' | 'white' | 'sparkling' | 'rose' | 'icewine' | 'natural' | 'dessert';
  aromaNote: string;
  tasteNote: string;
  finishNote: string;
  sweetness: number;
  acidity: number;
  tannin: number;
  body: number;
}