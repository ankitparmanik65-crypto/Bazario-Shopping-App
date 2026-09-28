import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchAutocomplete.css";

function SearchAutocomplete({
  products,
  value,
  onChange,
  placeholder = "Search products...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // ⭐ Products se suggestions nikalo
  useEffect(() => {
    if (!value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const searchLower = value.toLowerCase().trim();

    const matches = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
      .slice(0, 6); // Max 6 suggestions

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
    setHighlightedIndex(-1);
  }, [value, products]);

  // ⭐ Click outside pe dropdown close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSuggestionClick = (product) => {
    onChange("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    navigate(`/product/${product.id}`);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="search-autocomplete-wrapper" ref={wrapperRef}>
      <div className="search-container">
        <span className="search-icon">🔍</span>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && value.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {value && (
          <button
            className="clear-search"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          <div className="autocomplete-header">
            <span>Suggestions</span>
            <span className="autocomplete-count">
              {suggestions.length} found
            </span>
          </div>

          {suggestions.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`autocomplete-item ${
                index === highlightedIndex ? "highlighted" : ""
              }`}
              onClick={() => handleSuggestionClick(product)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="autocomplete-image"
              />

              <div className="autocomplete-info">
                <span className="autocomplete-name">{product.name}</span>
                <span className="autocomplete-category">
                  in {product.category}
                </span>
              </div>

              <span className="autocomplete-price">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete;