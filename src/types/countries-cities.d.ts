declare module 'countries-cities' {
    export function getAllCountries(): string[];
    export function getCities(country: string): string[];
  }