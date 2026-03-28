const FALLBACK_FACTS: Record<string, string> = {
  '3/26': 'March 26 is the 85th day of the year (86th in leap years). It is often associated with the beginning of spring festivals in many cultures.',
  '3/27': 'March 27 is World Theatre Day, created by the International Theatre Institute in 1961.',
  '1/1': 'January 1 is New Year\'s Day in the Gregorian calendar.',
  '10/2': 'October 2 is the birthday of Mahatma Gandhi, observed as the International Day of Non-Violence.',
};

export const fetchDateFact = async (month: number, day: number): Promise<string | null> => {
  const dateKey = `${month}/${day}`;
  try {
    // Numbers API can sometimes have CORS or HTTPS issues
    const response = await fetch(`https://numbersapi.com/${month}/${day}/date`, {
      signal: AbortSignal.timeout(3000) // 3s timeout
    });
    
    if (!response.ok) return FALLBACK_FACTS[dateKey] || null;
    
    const data = await response.text();
    return data || FALLBACK_FACTS[dateKey] || null;
  } catch (error) {
    // Silently handle fetch errors and return fallback if available
    return FALLBACK_FACTS[dateKey] || null;
  }
};
