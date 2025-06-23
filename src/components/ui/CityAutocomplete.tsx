'use client';

import React, { useState, useEffect } from 'react';
import { City } from 'country-state-city';

type Props = {
  countryCode: string;
  value: string;
  onChange: (value: string) => void;
};

const CityAutocomplete: React.FC<Props> = ({ countryCode, value, onChange }) => {
  const [query, setQuery] = useState(value);
  const [cities, setCities] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (countryCode) {
      const result = City.getCitiesOfCountry(countryCode)?.map((c) => c.name) || [];
      setCities(result);
    } else {
      setCities([]);
    }
  }, [countryCode]);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    setFiltered(
      cities.filter((name) => name.toLowerCase().includes(lowerQuery)).slice(0, 50)
    );
  }, [query, cities]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="border px-3 py-2 rounded w-full"
        placeholder="도시를 입력하세요"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      />
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto mt-1 rounded shadow">
          {filtered.map((city, idx) => (
            <li
              key={`${city}-${idx}`}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(city);
                setQuery(city);
                setShowDropdown(false);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;