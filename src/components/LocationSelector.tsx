'use client';

import React, { useEffect, useState } from 'react';
import { Country, City } from 'country-state-city';

type Props = {
  date: string; // yyyy-MM-dd
  onSelect?: (val: { country: string; city: string | null }) => void;
};

const LocationSelector: React.FC<Props> = ({ date, onSelect }) => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState<{ name: string }[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const countries = Country.getAllCountries();

  useEffect(() => {
    if (country) {
      const result = City.getCitiesOfCountry(country) || [];
      setCityOptions(result);
    } else {
      setCityOptions([]);
    }
  }, [country]);

  const handleSave = async () => {
    const payload = {
      date,
      country,
      city: city || null,
    };

    console.log('📤 저장 시도 데이터:', payload);

    try {
      const res = await fetch('/api/daily-locations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('📦 저장 결과:', result);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsSaved(true);
      onSelect?.({ country, city: city || null });
    } catch (error: any) {
      console.error('❌ 저장 실패:', error.message || error);
      alert(`저장 실패: ${error.message || error}`);
    }
  };

  return (
    <div className="flex flex-col gap-1 text-sm">
      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          setCity('');
          setIsSaved(false);
        }}
        className="border rounded px-2 py-1"
      >
        <option value="">국가 선택</option>
        {countries.map((c) => (
          <option key={c.isoCode} value={c.isoCode}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          setIsSaved(false);
        }}
        disabled={!country}
        className="border rounded px-2 py-1"
      >
        <option value="">도시 선택</option>
        {cityOptions.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-500 text-white text-xs rounded px-2 py-1 mt-1"
        disabled={!country}
        onClick={handleSave}
      >
        저장
      </button>

      {isSaved && <div className="text-green-500 text-xs mt-1">저장 완료</div>}
    </div>
  );
};

export default LocationSelector;