import type { WineAnalysis } from '../mock/diary/mock';

const WINE_DATA_KEY = 'wineData';

export const getStoredWineData = (): WineAnalysis | null => {
  if (typeof window === 'undefined') return null;
  
  const storedData = localStorage.getItem(WINE_DATA_KEY);
  if (!storedData) return null;

  try {
    return JSON.parse(storedData) as WineAnalysis;
  } catch (error) {
    console.error('Failed to parse stored wine data:', error);
    return null;
  }
};

export const storeWineData = (data: WineAnalysis): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WINE_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store wine data:', error);
  }
};

export const clearWineData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(WINE_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear wine data:', error);
  }
}; 