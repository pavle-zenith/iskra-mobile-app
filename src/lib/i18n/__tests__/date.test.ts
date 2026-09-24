import { formatDate, formatDateTime, formatDay } from '../date';

describe('Serbian dates', () => {
  it('put the month in the genitive', () => {
    const months = Array.from({ length: 12 }, (_, month) => formatDay(new Date(2026, month, 1)));
    expect(months).toEqual([
      '1. januara',
      '1. februara',
      '1. marta',
      '1. aprila',
      '1. maja',
      '1. juna',
      '1. jula',
      '1. avgusta',
      '1. septembra',
      '1. oktobra',
      '1. novembra',
      '1. decembra',
    ]);
  });

  it('close the year with a dot', () => {
    expect(formatDate(new Date(2026, 7, 15))).toBe('15. avgusta 2026.');
  });

  it('join date and time with "u", the time zero-padded', () => {
    expect(formatDateTime(new Date(2026, 7, 15, 7, 5))).toBe('15. avgusta 2026. u 07:05');
    expect(formatDateTime(new Date(2026, 8, 24, 23, 40))).toBe('24. septembra 2026. u 23:40');
  });
});
