import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchIcon from "../assets/search.svg?react";
import { useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { SearchBarProps } from "../types/type";
import { useSelector, useDispatch } from "react-redux";
import { updateQuery } from "../features/querySlice.ts";
import { updateSuggestions } from "../features/suggestionsSlice.ts";
import type { RootState } from "../store.ts";

export default function SearchBar({ handleSearchClick }: SearchBarProps) {
  const query = useSelector((state: RootState) => state.query.value);
  const suggestions = useSelector((state: RootState) => state.suggestions.value);
  const dispatch = useDispatch();
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        dispatch(updateSuggestions(null));
        return;
      }

      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/search.json?key=57cf083f7dc842cfb8a155518241212&q=${debouncedQuery}`
        );
        const data = await response.json();
        console.log("發送 api");
        const topSuggestions = data
          .slice(0, 5)
          .map((item: { name: string }) => item.name);
        dispatch(updateSuggestions(topSuggestions));
      } catch (error) {
        console.error("error message:", error);
        dispatch(updateSuggestions(null));
      }
    };

    fetchSuggestions();
    console.log(debouncedQuery);
  }, [debouncedQuery, dispatch]);

  const handleSuggestionClick = (suggestions: string) => {
    dispatch(updateQuery(suggestions)); //更新 query
    dispatch(updateSuggestions(null));
  };

  return (
    <div className="relative z-10 flex justify-center w-full py-8">
      <div className="relative flex w-full items-center bg-white/25 hover:bg-white/20 backdrop-blur-md border-0 rounded-md shadow-lg transition-all">
        <Input
          className="text-md rounded-none border-0 focus-visible:ring-0 text-white placeholder:text-white/50 "
          type="text"
          placeholder="Enter The City..."
          value={query}
          onChange={(e) => dispatch(updateQuery(e.target.value))}
        />
        <Button
          className="absolute right-0 rounded-s-none rounded-e-md bg-gray-900 hover:bg-gray-800"
          type="submit"
          onClick={handleSearchClick}
        >
          <SearchIcon />
        </Button>
        {/* 搜尋建議列表 */}
        {(suggestions && suggestions.length > 0 ) && (
          <ul className="absolute top-full w-full bg-white/90 text-black rounded-md shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
