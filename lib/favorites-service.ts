// Service to manage favorite locations using localStorage
// This allows users to save and retrieve their favorite cities

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  lastAccessed: number;
}

class FavoritesService {
  private readonly STORAGE_KEY = 'weather_favorites';
  
  getFavorites(): FavoriteLocation[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const favorites = localStorage.getItem(this.STORAGE_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  }
  
  addFavorite(location: Omit<FavoriteLocation, 'id' | 'lastAccessed'>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      const existingIndex = favorites.findIndex(fav => fav.name === location.name);
      
      if (existingIndex >= 0) {
        // Update existing favorite
        favorites[existingIndex] = {
          ...favorites[existingIndex],
          lastAccessed: Date.now()
        };
      } else {
        // Add new favorite
        const newFavorite: FavoriteLocation = {
          id: Math.random().toString(36).substring(2, 9),
          ...location,
          lastAccessed: Date.now()
        };
        favorites.push(newFavorite);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorite to localStorage:', error);
    }
  }
  
  removeFavorite(id: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite from localStorage:', error);
    }
  }
  
  isFavorite(name: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.name === name);
  }
}

export const favoritesService = new FavoritesService();
