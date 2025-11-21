import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CenteredLocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const cancelTokenRef = useRef(null);

  // Debounce state
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Update debouncedQuery 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel(); // cancel previous request
      }

      cancelTokenRef.current = axios.CancelToken.source();
      setLoading(true);

      try {
        const res = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: debouncedQuery,
            format: "json",
            limit: 5,
          },
          cancelToken: cancelTokenRef.current.token,
        });

        setResults(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    onSelect({
      lat: item.lat,
      lon: item.lon,
    });
    setQuery(item.display_name);
    setResults([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-500 p-6">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 relative">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">Search Location</h1>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            className="w-full p-4 rounded-2xl border border-gray-300 text-gray-700 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Dropdown */}
          {results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden z-50 max-h-64 overflow-y-auto border border-gray-200">
              {results.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(item)}
                  className="p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium text-gray-800">{item.display_name}</div>
                </div>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              ...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
