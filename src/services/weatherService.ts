import { WeatherData, Location } from '../types';

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  weatherCode: number;
}

const WEATHER_CODES: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear sky', icon: '☀️' },
  1: { condition: 'Mainly clear', icon: '🌤️' },
  2: { condition: 'Partly cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Fog', icon: '🌫️' },
  48: { condition: 'Depositing rime fog', icon: '🌫️' },
  51: { condition: 'Light drizzle', icon: '🌦️' },
  53: { condition: 'Moderate drizzle', icon: '🌦️' },
  55: { condition: 'Dense drizzle', icon: '🌦️' },
  61: { condition: 'Slight rain', icon: '🌧️' },
  63: { condition: 'Moderate rain', icon: '🌧️' },
  65: { condition: 'Heavy rain', icon: '🌧️' },
  71: { condition: 'Slight snow', icon: '❄️' },
  73: { condition: 'Moderate snow', icon: '❄️' },
  75: { condition: 'Heavy snow', icon: '❄️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
};

export const fetchWeather = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weathercode&timezone=auto&forecast_days=16`
    );
    const data = await response.json();

    const daily: DailyForecast[] = data.daily.time.map((time: string, i: number) => ({
      date: time,
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      weatherCode: data.daily.weathercode[i],
      condition: WEATHER_CODES[data.daily.weathercode[i]]?.condition || 'Unknown',
    }));

    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time,
      temp: Math.round(data.hourly.temperature_2m[i]),
      weatherCode: data.hourly.weathercode[i],
      condition: WEATHER_CODES[data.hourly.weathercode[i]]?.condition || 'Unknown',
    }));

    return { daily, hourly };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id.toString(),
      name: `${item.name}, ${item.admin1 || ''} ${item.country}`,
      lat: item.latitude,
      lng: item.longitude,
      enabled: true,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const getWeatherIcon = (code: number) => {
  return WEATHER_CODES[code]?.icon || '❓';
};
