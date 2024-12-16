import { WeatherApiResponse, Suggestion } from "../types/type";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

// 調用 api 獲取城市天氣資料
export async function getCityWeather(
  query: string
): Promise<WeatherApiResponse> {
  const response =
    await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=6&aqi=no&alerts=no
`).then((res) => res.json());

  // 晚 0.5 秒送出結果，讓載入動畫有機會出現
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 500);
  });
}

// 調用 api 獲取模糊搜尋資料
export async function getSuggestions(
  debouncedQuery: string
): Promise<Suggestion[]> {
  const response =
    await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${debouncedQuery}
`).then((res) => res.json());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 500);
  });
}
