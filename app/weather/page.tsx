'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Sunrise, Sunset, Gauge, Star, StarOff, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIcon } from '@/components/weather-icon';
import { weatherService, type WeatherData, type ForecastData } from '@/lib/weather-service';
import { favoritesService, type FavoriteLocation } from '@/lib/favorites-service';
import { locationService } from '@/lib/location-service';

export default function WeatherPage() {
  const [city, setCity] = useState('New York');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [locating, setLocating] = useState(false);

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather and forecast data
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      
      // Check if current city is a favorite
      const isCityFavorite = favoritesService.isFavorite(cityName);
      setIsFavorite(isCityFavorite);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load favorites on component mount
    const loadedFavorites = favoritesService.getFavorites();
    setFavorites(loadedFavorites);
    
    fetchWeatherData(city);
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLocating(true);
      setError(null);
      
      const location = await locationService.getLocationWithCity();
      setCity(location.city);
      fetchWeatherData(location.city);
    } catch (err) {
      setError('Failed to get current location. Please try searching for a city.');
      console.error(err);
    } finally {
      setLocating(false);
    }
  };

  const toggleFavorite = () => {
    if (!weather) return;
    
    if (isFavorite) {
      // Remove from favorites
      const favorite = favorites.find(fav => fav.name === weather.name);
      if (favorite) {
        favoritesService.removeFavorite(favorite.id);
        setIsFavorite(false);
      }
    } else {
      // Add to favorites
      favoritesService.addFavorite({
        name: weather.name,
        country: weather.sys.country
      });
      setIsFavorite(true);
    }
    
    // Update favorites list
    setFavorites(favoritesService.getFavorites());
  };

  const formatTime = (timestamp: number) => {
    return weatherService.formatTime(timestamp);
  };

  const formatDate = (timestamp: number) => {
    return weatherService.formatDate(timestamp);
  };

  const formatDay = (timestamp: number) => {
    return weatherService.formatDay(timestamp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Weather Forecast</h1>
          <p className="text-gray-600 dark:text-gray-300">Get detailed weather information for any location</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" onClick={handleSearch}>Search</Button>
              <Button 
                variant="outline" 
                onClick={getCurrentLocation} 
                disabled={locating}
                className="flex items-center gap-2"
              >
                <Locate className="h-4 w-4" />
                {locating ? 'Locating...' : 'My Location'}
              </Button>
            </div>
            
            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Favorite Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <Button
                      key={fav.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setCity(fav.name)}
                      className="text-xs"
                    >
                      {fav.name}, {fav.country}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="space-y-6">
            {/* Current Weather Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div>
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forecast Skeleton */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-40" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-12 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => fetchWeatherData(city)} className="mt-4">Try Again</Button>
            </CardContent>
          </Card>
        ) : weather && forecast ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {weather.name}, {weather.sys.country}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleFavorite}
                    className="text-white hover:text-yellow-300 hover:bg-white/20"
                  >
                    {isFavorite ? (
                      <Star className="h-5 w-5 fill-current" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div>
                      {weather.weather[0]?.icon && (
                        <WeatherIcon 
                          iconCode={weather.weather[0].icon} 
                          alt={weather.weather[0].description} 
                          width={96}
                          height={96}
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</div>
                      <div className="text-xl capitalize">{weather.weather[0]?.description || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <span>Feels like {Math.round(weather.main.feels_like)}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span>Humidity {weather.main.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4" />
                      <span>Wind {weather.wind.speed} m/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>Visibility {(weather.visibility / 1000).toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>Pressure {weather.main.pressure} hPa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-4 w-4" />
                      <span>Sunrise {formatTime(weather.sys.sunrise)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sunset className="h-4 w-4" />
                      <span>Sunset {formatTime(weather.sys.sunset)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hourly Forecast */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                  {forecast.list.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {index === 0 ? 'Now' : new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' })}
                      </div>
                      {item.weather[0]?.icon && (
                        <WeatherIcon 
                          iconCode={item.weather[0].icon} 
                          alt={item.weather[0].description} 
                          width={48}
                          height={48}
                        />
                      )}
                      <div className="font-medium">{Math.round(item.main.temp)}°</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(item.pop * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Weather Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Today's Highlights</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">High / Low</div>
                    <div className="text-xl font-semibold">
                      {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Humidity</div>
                    <div className="text-xl font-semibold">{weather.main.humidity}%</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wind</div>
                    <div className="text-xl font-semibold">{weather.wind.speed} m/s</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sunrise & Sunset</div>
                    <div className="text-sm">
                      <div>↑ {formatTime(weather.sys.sunrise)}</div>
                      <div>↓ {formatTime(weather.sys.sunset)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>7-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Group forecast by day */}
                    {Array.from({ length: 7 }, (_, i) => {
                      const dayData = forecast.list.find(item => {
                        const itemDate = new Date(item.dt * 1000);
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() + i);
                        return itemDate.getDate() === targetDate.getDate();
                      });
                      
                      return (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="w-1/4 text-gray-500 dark:text-gray-400">
                            {i === 0 ? 'Today' : formatDay(Date.now() / 1000 + i * 86400)}
                          </div>
                          <div className="w-1/4 flex justify-center">
                            {dayData?.weather[0]?.icon ? (
                              <WeatherIcon 
                                iconCode={dayData.weather[0].icon} 
                                alt={dayData.weather[0].description} 
                                width={32}
                                height={32}
                              />
                            ) : (
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                            )}
                          </div>
                          <div className="w-1/4 text-center">
                            <span className="font-medium">
                              {dayData ? Math.round(dayData.main.temp) : 20 + i}°
                            </span>
                          </div>
                          <div className="w-1/4 text-right text-gray-500 dark:text-gray-400">
                            {dayData ? Math.round(dayData.main.temp_min) : 15 + i}°
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
