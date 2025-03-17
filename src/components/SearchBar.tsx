import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchIcon from "../assets/search.svg?react";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { ForecastDay } from "../types/type";
import { useSelector, useDispatch } from "react-redux";
import { updateQuery } from "../features/querySlice.ts";
import type { RootState } from "../store.ts";
import { updateLoading } from "@/features/loadingSlice.ts";
import { updateProgress } from "@/features/progressSlice.ts";
import { updateCityWeather } from "@/features/cityWeatherSlice.ts";
import { updateHistory } from "@/api/getFirebaseData.ts";
import { auth } from "@/ultils/firebase.ts";
import useSWRMutation from "swr/mutation";
import { toast } from "@/hooks/useToast.ts";
import useSWR from "swr";
import { useWeather } from "@/api/useWeather.ts";
import { useSuggestions } from "@/api/useSuggestions.ts";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export default function SearchBar() {
  const query = useSelector((state: RootState) => state.query.value);
  const dispatch = useDispatch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { weatherFetcher } = useWeather();
  const { suggestionsFetcher } = useSuggestions();
  const { trigger } = useSWRMutation('weather', weatherFetcher)

  //處理搜尋按鈕被點擊
  const handleSearchClick = async () => {
    //若 query 為空，不執行後續動作
    if (!query) {
      return;
    }

    try {
      dispatch(updateLoading(true));
      dispatch(updateProgress(0));
      
      const result = await trigger(query);
      
      if (result) {
        dispatch(
          updateCityWeather({
            location: {
              name: result.location.name,
              country: result.location.country,
              localtime: result.location.localtime,
            },
            current: {
              condition: {
                text: result.current.condition.text,
                icon: result.current.condition.icon,
              },
              temp_c: result.current.temp_c,
            },
            forecast: {
              forecastday: result.forecast.forecastday
                .slice(1, 6)
                .map((forecastDay: ForecastDay) => ({
                  date: forecastDay.date,
                  day: {
                    condition: {
                      text: forecastDay.day.condition.text,
                      icon: forecastDay.day.condition.icon,
                    },
                    maxtemp_c: forecastDay.day.maxtemp_c,
                    mintemp_c: forecastDay.day.mintemp_c,
                  },
                })),
            },
          })
        );

        //確認目前是否有登入者，若登入者存在，將記錄存到 db
        const user = auth.currentUser;
        if (user) {
          updateHistory(user.uid, result.location.name);
        }
      }
      
      dispatch(updateProgress(100));
    } catch (e) {
      toast({
        description: `Whoops: can't find the city, please try again!`,
      });
      console.error(e)
    } finally {
      dispatch(updateLoading(false));
    }
  };

  const { data } = useSWR(debouncedQuery ? `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${debouncedQuery}` : null, suggestionsFetcher)
  const topSuggestions = data?.slice(0, 5).map((item: { name: string }) => item.name)

  //控制點選建議列表項目
  const handleSuggestionClick = (suggestion: string) => {
    dispatch(updateQuery(suggestion)); //更新 query
    setShowSuggestions(false);
    handleSearchClick();
  };

  //控制點擊建議欄外的區域，可以關閉建議欄位
  const handleOutsideClick = (event: MouseEvent) => {
    //確認 wrapperRef 存在並且點擊位置於 DOM 元素外部
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateQuery(e.target.value));
    setShowSuggestions(true);
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
          onChange={handleInputChange}
        />
        <Button
          className="absolute right-0 rounded-s-none rounded-e-md bg-gray-900 hover:bg-gray-800"
          type="submit"
          onClick={handleSearchClick}
        >
          <SearchIcon />
        </Button>
        {/* 搜尋建議列表 */}
        {showSuggestions && topSuggestions && topSuggestions.length > 0 && (
          <ul className="absolute top-full w-full bg-white/90 text-black rounded-md shadow-md">
            {topSuggestions.map((suggestion: string, index: number) => (
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
