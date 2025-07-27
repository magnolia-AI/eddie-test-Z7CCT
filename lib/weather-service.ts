// Weather service to handle API calls to OpenWeatherMap
// This service will be used when the API key is available

const API_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  dt: number;
  timezone: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

class WeatherService {
  private apiKey: string | undefined;

  constructor() {
    // In a real app, this would be set from environment variables
    // this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.apiKey = undefined; // For now, we'll use mock data
  }

  async getCurrentWeather(city: string): Promise<WeatherData> {
    if (!this.apiKey) {
      // Return mock data when no API key is available
      return this.getMockCurrentWeather(city);
    }

    try {
      const response = await fetch(
        `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch current weather data');
    }
  }

  async getForecast(city: string): Promise<ForecastData> {
    if (!this.apiKey) {
      // Return mock data when no API key is available
      return this.getMockForecast(city);
    }

    try {
      const response = await fetch(
        `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }

  private getMockCurrentWeather(city: string): WeatherData {
    // Mock data for demonstration
    return {
      name: city,
      sys: {
        country: 'US',
        sunrise: Date.now() / 1000 - 3600 * 6,
        sunset: Date.now() / 1000 + 3600 * 6
      },
      main: {
        temp: 22,
        feels_like: 23,
        temp_min: 19,
        temp_max: 25,
        pressure: 1015,
        humidity: 65
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }
      ],
      wind: {
        speed: 3.5,
        deg: 180
      },
      visibility: 10000,
      clouds: {
        all: 0
      },
      dt: Date.now() / 1000,
      timezone: -14400
    };
  }

  private getMockForecast(city: string): ForecastData {
    // Mock forecast data for demonstration
    return {
      list: Array.from({ length: 40 }, (_, i) => ({
        dt: Date.now() / 1000 + i * 3600 * 3,
        main: {
          temp: 20 + (i % 5),
          feels_like: 21 + (i % 5),
          temp_min: 18 + (i % 3),
          temp_max: 23 + (i % 4),
          pressure: 1015,
          sea_level: 1020,
          grnd_level: 1010,
          humidity: 60 + (i % 10),
          temp_kf: 0
        },
        weather: [
          {
            id: 800 + (i % 3),
            main: i % 3 === 0 ? 'Clear' : i % 3 === 1 ? 'Clouds' : 'Rain',
            description: i % 3 === 0 ? 'clear sky' : i % 3 === 1 ? 'few clouds' : 'light rain',
            icon: i % 3 === 0 ? '01d' : i % 3 === 1 ? '02d' : '10d'
          }
        ],
        clouds: {
          all: i * 10
        },
        wind: {
          speed: 2 + i * 0.5,
          deg: 180 + i * 10,
          gust: 3 + i * 0.3
        },
        visibility: 10000,
        pop: i * 0.1,
        sys: {
          pod: 'd'
        },
        dt_txt: new Date(Date.now() + i * 3600 * 3).toISOString()
      })),
      city: {
        id: 5128581,
        name: city,
        coord: {
          lat: 40.7128,
          lon: -74.0060
        },
        country: 'US',
        population: 8175133,
        timezone: -14400,
        sunrise: Date.now() / 1000 - 3600 * 6,
        sunset: Date.now() / 1000 + 3600 * 6
      }
    };
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  formatDay(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'long' });
  }
}

export const weatherService = new WeatherService();
