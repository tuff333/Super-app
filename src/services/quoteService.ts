export interface Quote {
  content: string;
  author: string;
  gujaratiContent: string;
}

const PRAMUKH_SWAMI_QUOTES = [
  "બીજાના ભલામાં આપણું ભલું છે.",
  "ભગવાન ભજવા અને બીજાનું ભલું કરવું.",
  "સેવા એ જ પરમ ધર્મ છે.",
  "નમ્રતા એ જ સાચું જ્ઞાન છે.",
  "શાંતિ અને સંતોષ એ જ સાચું સુખ છે.",
  "પરસ્પર પ્રીતિ પ્રસરાવે તે જ સાચો ધર્મ.",
  "જેવું અન્ન તેવું મન.",
  "સત્સંગ એ જ જીવનનું સાચું ભાથું છે."
];

export const fetchDailyQuote = async (): Promise<Quote | null> => {
  try {
    const randomIndex = Math.floor(Math.random() * PRAMUKH_SWAMI_QUOTES.length);
    const gujaratiContent = PRAMUKH_SWAMI_QUOTES[randomIndex];
    
    return {
      content: gujaratiContent, // Default to Gujarati
      author: "Pramukh Swami Maharaj",
      gujaratiContent: gujaratiContent
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    return {
      content: "બીજાના ભલામાં આપણું ભલું છે.",
      author: "Pramukh Swami Maharaj",
      gujaratiContent: "બીજાના ભલામાં આપણું ભલું છે."
    };
  }
};
