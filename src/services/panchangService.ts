import { PanchangData } from '../types';

// Mock data generator for Gujarati Panchang
// In a real app, this would use a library like 'drik-panchang' or a backend API
export const getPanchangForDate = (date: Date): PanchangData => {
  const day = date.getDate();
  const month = date.getMonth();
  
  // Very simplified logic for demonstration
  let tithiNum = (day % 15) + 1;
  let paksha: 'Sud' | 'Vad' = day <= 15 ? 'Sud' : 'Vad';
  
  if (month === 2 && day === 26) {
    tithiNum = 8; // Atham
    paksha = 'Sud';
  }
  
  const tithis = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 
    'Shashti', 'Saptami', 'Atham/Nom', 'Navami', 'Dashami', 
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];

  const isEkadashi = tithiNum === 11;
  const isPoonam = day === 15;
  const isAmas = day === 30 || (month === 1 && day === 28); // Simplified

  let festival: string | undefined;
  if (isEkadashi) festival = 'Ekadashi';
  if (isPoonam) festival = 'Poonam';
  if (isAmas) festival = 'Amas';
  
  // Specific Gujarati Festivals
  if (month === 2 && day === 26) festival = 'Swaminarayan Jayanti / Ram Navmi';
  if (month === 2 && day === 25) festival = 'Holi-Dhuleti';
  if (month === 7 && day === 15) festival = 'Raksha Bandhan';
  if (month === 7 && day === 25) festival = 'Janmashtami';
  if (month === 8 && day === 19) festival = 'Ganesh Chaturthi';
  if (month === 9 && day === 15) festival = 'Navratri Start';
  if (month === 9 && day === 24) festival = 'Dussehra';
  if (month === 10 && day === 12) festival = 'Diwali';
  if (month === 10 && day === 13) festival = 'Bestu Varas (New Year)';
  if (month === 10 && day === 14) festival = 'Bhai Dooj';
  if (month === 0 && day === 14) festival = 'Uttarayan';

  return {
    tithi: tithis[tithiNum - 1],
    tithiNum,
    paksha,
    nakshatra: 'Ashwini', // Mock
    yoga: 'Vishkumbha', // Mock
    karana: 'Bava', // Mock
    isEkadashi,
    isPoonam,
    isAmas,
    festival
  };
};
