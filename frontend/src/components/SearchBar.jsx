import { useState } from 'react';

export default function SearchBar({ onSearch, onLocation }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={onLocation}>📍 My Location</button>
    </form>
  );
}