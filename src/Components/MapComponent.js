import React, { useState, useEffect } from "react";

const LocationSearchWithSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapUrl, setMapUrl] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  // Debounced fetch
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        });
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (place) => {
    setSelectedAddress(place.display_name);
    setSuggestions([]);
    setQuery(place.display_name);
    setMapUrl(`https://www.google.com/maps?q=draper%20startup%20house&output=embed`);
  };

  return (
    <div style={{ padding: "20px", position: "relative", maxWidth: "600px" }}>
      <h2>Location Search with Suggestions</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Start typing a location..."
        style={{ padding: "8px", width: "100%" }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          background: "#fff",
          border: "1px solid #ccc",
          position: "absolute",
          width: "100%",
          zIndex: 10,
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {selectedAddress && (
        <div style={{ marginTop: "20px" }}>
          <strong>Selected Address:</strong> {selectedAddress}
        </div>
      )}

      {mapUrl && (
        <div style={{ marginTop: "20px" }}>
          <iframe
            title="Google Map"
            src={mapUrl}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default LocationSearchWithSuggestions;
