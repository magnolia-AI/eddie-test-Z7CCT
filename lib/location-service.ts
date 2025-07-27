// Service to handle geolocation and reverse geocoding

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

class LocationService {
  // Get current position using browser geolocation
  getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocode coordinates to get city name
  // In a real app, this would call a reverse geocoding API
  async reverseGeocode(location: Location): Promise<{ city: string; country: string }> {
    // For now, we'll return mock data
    // In a real implementation, you would use a service like:
    // https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={API key}
    
    return {
      city: 'New York',
      country: 'US'
    };
  }

  // Get location with city name
  async getLocationWithCity(): Promise<Location & { city: string; country: string }> {
    try {
      const location = await this.getCurrentPosition();
      const { city, country } = await this.reverseGeocode(location);
      
      return {
        ...location,
        city,
        country
      };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService();
