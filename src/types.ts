export type AppModule = 'dashboard' | 'nirnay' | 'vault' | 'office' | 'browser' | 'nexus' | 'globetrot' | 'settings' | 'crm' | 'budgeted' | 'calculator' | 'spiritual' | 'pdf';

export type Language = 'en' | 'gu' | 'hi' | 'ta' | 'mr' | 'fr' | 'ru';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

export interface PanchangData {
  tithi: string;
  tithiNum: number;
  paksha: 'Sud' | 'Vad';
  nakshatra: string;
  yoga: string;
  karana: string;
  isEkadashi: boolean;
  isPoonam: boolean;
  isAmas: boolean;
  festival?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  minTemp?: number;
  maxTemp?: number;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  enabled: boolean;
}

export interface CalendarDay {
  date: Date;
  gujaratiDate: number;
  panchang: PanchangData;
  weather?: WeatherData;
}
