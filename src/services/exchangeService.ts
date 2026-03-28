export const fetchExchangeRates = async (base: string = 'INR'): Promise<Record<string, number> | null> => {
  try {
    // Using ExchangeRate-API (part of public-apis)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};
