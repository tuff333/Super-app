import { PanchangData } from './types';

export const getLocalPanchangSummary = (panchang: PanchangData): string => {
  const summaries: Record<string, string> = {
    'Ekadashi': "A powerful day for fasting and spiritual cleansing. Focus on inner peace.",
    'Poonam': "The full moon brings peak energy. Ideal for meditation and gratitude.",
    'Amas': "A day for ancestral remembrance and quiet reflection. New beginnings await.",
    'Swaminarayan Jayanti / Ram Navmi': "Celebrate the divine appearance with devotion and joy.",
    'Holi-Dhuleti': "Let the colors of joy and brotherhood fill your life today.",
    'Raksha Bandhan': "A day to honor the sacred bond of protection and love.",
    'Janmashtami': "Celebrate the birth of Lord Krishna with bhajans and fasting.",
    'Ganesh Chaturthi': "Invoke the remover of obstacles for success in all your endeavors.",
    'Navratri Start': "The nine nights of divine feminine energy begin. Jai Mata Di!",
    'Dussehra': "Victory of good over evil. A day to conquer your inner weaknesses.",
    'Diwali': "The festival of lights. May your life be filled with prosperity and wisdom.",
    'Bestu Varas (New Year)': "Saal Mubarak! A fresh start for a year full of possibilities.",
    'Uttarayan': "The sun moves north. A time for transition and higher aspirations.",
  };

  if (panchang.festival && summaries[panchang.festival]) {
    return summaries[panchang.festival];
  }

  if (panchang.paksha === 'Sud') {
    if (panchang.tithiNum <= 5) return "The waxing moon brings growing energy. Start new projects.";
    if (panchang.tithiNum <= 10) return "Energy is building up. Stay focused on your goals.";
    return "The moon is near full. A time for high activity and social connection.";
  } else {
    if (panchang.tithiNum <= 5) return "The waning moon suggests reflection. Consolidate your gains.";
    if (panchang.tithiNum <= 10) return "A time for letting go of what no longer serves you.";
    return "Energy is low. Focus on rest, recovery, and internal work.";
  }
};

export const getLocalQuoteTranslation = (quote: string, targetLang: string): string => {
  // Very simple mock translation for common phrases
  // In a real app, this would be a large dictionary or a local WASM model
  return `[Local ${targetLang}] ${quote}`;
};

export const getLocalDailyFact = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  const facts: Record<string, string> = {
    '1-1': "New Year's Day is celebrated globally.",
    '8-15': "India gained independence from British rule in 1947.",
    '10-2': "Mahatma Gandhi's birthday, observed as International Day of Non-Violence.",
    '1-14': "Makar Sankranti marks the transition of the Sun into Capricorn.",
  };

  const key = `${month}-${day}`;
  return facts[key] || "On this day in history, the world continued to evolve and create new stories.";
};
