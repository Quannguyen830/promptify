"use client";

import { useState } from "react";
import { type BaseProps } from "~/constants/interfaces";
import SearchCarousel from "./search-carousel";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Search } from "lucide-react";
import { type SearchResult } from "~/constants/interfaces";

const SearchViewer: React.FC<BaseProps> = ({ className }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json() as { results: SearchResult[] };
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      void handleSearch();
    }
  };

  return (
    <div className={`flex flex-col gap-8 overflow-y-auto pr-2 rounded-[8px] h-full ${className}`}>
      <div className="flex flex-col gap-4">
        <h2 className="text-[42px] font-bold">Searching Assistant</h2>
        <div className="flex gap-2 max-w-[400px]">
          <Input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={() => void handleSearch()}
            disabled={isLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {isLoading ? (
          <div>Loading...</div>
        ) : results.length > 0 ? (
          <SearchCarousel title="Search Results" results={results} />
        ) : (
          <p className="text-gray-600">
            {query ? "No results found" : "Enter a search term and click search to begin"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchViewer; 