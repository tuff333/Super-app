export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export const fetchHolidays = async (year: number, countryCode: string = 'IN'): Promise<Holiday[]> => {
  try {
    // Using Nager.Date API (part of public-apis)
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    if (!response.ok) {
      if (response.status === 404 || response.status === 204) return [];
      throw new Error('Failed to fetch holidays');
    }
    const text = await response.text();
    if (!text) return [];
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};
