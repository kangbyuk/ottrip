'use client';

import React, { useState, useEffect } from 'react';
import { Country } from 'country-state-city';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const CountryAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredCountries, setFilteredCountries] = useState<{ name: string; isoCode: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const allCountries = Country.getAllCountries();

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredCountries([]);
      return;
    }

    const filtered = allCountries.filter((c) =>
      c.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredCountries(filtered);
  }, [inputValue]);

  const handleSelect = (country: { name: string; isoCode: string }) => {
    setInputValue(country.name);
    onChange(country.isoCode); // isoCode만 전달
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Enter country"
        className="border px-3 py-2 rounded w-full"
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // 클릭 허용 시간 확보
      />
      {showDropdown && filteredCountries.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded mt-1 max-h-48 overflow-y-auto w-full shadow">
          {filteredCountries.map((c) => (
            <li
              key={c.isoCode}
              onClick={() => handleSelect(c)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountryAutocomplete;