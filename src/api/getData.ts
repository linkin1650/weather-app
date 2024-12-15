import { WeatherApiResponse, Suggestion } from "../types/type";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export async function getCityWeather(
  query: string
): Promise<WeatherApiResponse> {
  const response =
    await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=6&aqi=no&alerts=no
`).then((res) => res.json());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 500);
  });
}

export async function getSuggestions(
  debouncedQuery: string
): Promise<Suggestion[]> {
  const response =
    await fetch(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${debouncedQuery}
`).then((res) => res.json());

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 500);
  });
}
