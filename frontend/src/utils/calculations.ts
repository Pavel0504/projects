import { ServiceItem } from '../types';

export const calculateItemTotal = (item: Omit<ServiceItem, 'total'>): number => {
  const subtotal = item.quantity * item.price;
  const discountAmount = (subtotal * item.discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = (afterDiscount * item.vat) / 100;
  return afterDiscount + vatAmount;
};

export const calculateTotals = (services: ServiceItem[]) => {
  const subtotal = services.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalDiscount = services.reduce((sum, item) => sum + ((item.quantity * item.price * item.discount) / 100), 0);
  const total = services.reduce((sum, item) => sum + item.total, 0);

  return {
    subtotal,
    discount: totalDiscount,
    total
  };
};

export const numberToWords = (num: number): string => {
  const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];

  if (num === 0) return 'ноль';

  const integer = Math.floor(num);
  const decimal = Math.round((num - integer) * 100);

  let result = '';

  if (integer >= 1000) {
    const thousands = Math.floor(integer / 1000);
    result += convertHundreds(thousands) + ' тысяч ';
  }

  result += convertHundreds(integer % 1000);

  if (decimal > 0) {
    result += ` рублей ${decimal.toString().padStart(2, '0')} копеек`;
  } else {
    result += ' рублей';
  }

  return result.trim().replace(/\s+/g, ' ');

  function convertHundreds(n: number): string {
    let str = '';
    
    if (n >= 100) {
      str += hundreds[Math.floor(n / 100)] + ' ';
    }
    
    const remainder = n % 100;
    
    if (remainder >= 10 && remainder < 20) {
      str += teens[remainder - 10];
    } else {
      if (remainder >= 20) {
        str += tens[Math.floor(remainder / 10)] + ' ';
      }
      if (remainder % 10 > 0) {
        str += ones[remainder % 10];
      }
    }
    
    return str.trim();
  }
};