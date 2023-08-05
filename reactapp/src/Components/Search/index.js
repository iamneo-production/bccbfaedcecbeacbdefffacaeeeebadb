import React, { useState, useEffect, useRef } from 'react';

function Search() {
  const [searchTerm, setSearchTerm] = useState('Programming');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
    }, 500);
  };

  const handleSearch = async () => {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${searchTerm}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const titles = data[1];
      const links = data[3];
      const results = titles.map((title, index) => ({
        text: title,
        href: links[index],
      }));
      setSearchResults(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isSearching) {
      handleSearch();
    }
  }, [isSearching]);
  useEffect(() => {
    if (showSuggestions) {
      clearTimeout(suggestionTimeoutRef.current);
    } else {
      suggestionTimeoutRef.current = setTimeout(() => {
        setSearchTerm('Programming');
        setSearchResults([]);
      }, 200);
    }
  }, [showSuggestions]);

  return (
    <div>
      <h1>Wiki Search</h1>
      <form>
        <label htmlFor="searchterm">Search term:</label>
        <input
          data-testid="searchterm"
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          ref={searchInputRef}
        />
      </form>
      {searchResults.length > 0 && (
        <ul data-testid="suggestion">
          {searchResults.map((result, index) => (
            <li key={index}>
              <a href={result.href}>{result.text}</a>
            </li>
          ))}
        </ul>
      )}
   </div>
  );
}

export default Search;