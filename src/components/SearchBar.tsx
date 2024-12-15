import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import SearchIcon from "/public/search.svg?react";
import { useEffect, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import { SearchBarProps } from "../types/type";
import { useSelector, useDispatch } from "react-redux";
import { updateQuery } from "../features/querySlice.ts";
import { updateSuggestions } from "../features/suggestionsSlice.ts";
import { updateSelected } from "../features/selectedSlice.ts";
import type { RootState } from "../store.ts";
import { getSuggestions } from "@/api/getData.ts";

export default function SearchBar({ handleSearchClick }: SearchBarProps) {
  const query = useSelector((state: RootState) => state.query.value);
  const suggestions = useSelector(
    (state: RootState) => state.suggestions.value
  );
  const selected = useSelector((state: RootState) => state.selected.value);
  const dispatch = useDispatch();
  const debouncedQuery = useDebounce(query, 300);

  const wrapperRef = useRef<HTMLDivElement>(null); // 追踪搜索框和建议列表的容器

  useEffect(() => {
    const fetchSuggestions = async () => {
      //若使用者點選建議列表項目後，避免再次調用模糊搜尋 api
      if (selected) {
        dispatch(updateSelected(false));
        return;
      }

      if (!debouncedQuery) {
        dispatch(updateSuggestions(null));
        return;
      }

      try {
        const data = await getSuggestions(debouncedQuery); //調用模糊搜尋 api
        const topSuggestions = data.slice(0, 5).map((item) => item.name);
        dispatch(updateSuggestions(topSuggestions));
      } catch (error) {
        console.error("error message:", error);
        dispatch(updateSuggestions(null));
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  //控制點選建議列表項目
  const handleSuggestionClick = (suggestions: string) => {
    dispatch(updateQuery(suggestions)); //更新 query
    dispatch(updateSuggestions(null)); //將建議列表清空
    dispatch(updateSelected(true)); //利用 Selected 控制 useEffect 不再調用一次 api
  };

  //控制點擊建議欄外的區域，可以關閉建議欄位
  const handleOutsideClick = (event: MouseEvent) => {
    //確認 wrapperRef 存在並且點擊位置於 DOM 元素外部
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      dispatch(updateSuggestions(null));
    }
  };

  //監聽整個 document 滑鼠點擊的事件
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative z-10 flex justify-center w-full pt-16 px-8 sm:pt-8 mb-2">
      <div
        className="relative flex w-full items-center bg-white/25 hover:bg-white/20 backdrop-blur-md border-0 rounded-md shadow-lg transition-all"
        ref={wrapperRef}
      >
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
        {suggestions && suggestions.length > 0 && (
          <ul className="absolute top-full w-full bg-white/90 text-black rounded-md shadow-md">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer rounded-md border-b-2 hover:bg-gray-200"
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
