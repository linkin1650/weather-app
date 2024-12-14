import Board from "./components/Board";
import SearchBar from "./components/SearchBar";
import { useEffect } from "react";
import { ForecastDay } from "./types/type";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store.ts";
import { updateCityWeather } from "./features/cityWeatherSlice.ts";

export default function App() {
  const query = useSelector((state: RootState) => state.query.value);
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );
  const dispatch = useDispatch();
  // const [cityData, setCityData] = useState<WeatherApiResponse | null>(null);

  const handleSearchClick = async () => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}=${query}&days=6&aqi=no&alerts=no`
      );

      const data = await response.json();
      dispatch(
        updateCityWeather({
          location: {
            name: data.location.name,
            country: data.location.country,
            localtime: data.location.localtime,
          },
          current: {
            condition: {
              text: data.current.condition.text,
              icon: data.current.condition.icon,
            },
            temp_c: data.current.temp_c,
          },
          forecast: {
            forecastday: data.forecast.forecastday
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
    } catch (error) {
      console.error("Fail to fetch weather data", error);
    }
  };

  useEffect(() => {
    console.log("Updated cityData:", cityWeather);
  }, [cityWeather]);

  return (
    <main className="relative flex justify-center h-screen">
      <div className="absolute top-0 left-0 -z-50 w-full h-full overflow-hidden">
        <video
          className="fixed top-0 left-0 h-full w-full aspect-video object-cover contrast-75"
          autoPlay
          muted
          loop
        >
          <source src="../src/assets/rain.mp4"></source>
        </video>
      </div>
      <div className="flex flex-col w-full max-w-sm md:max-w-md lg:max-w-3xl">
        <SearchBar handleSearchClick={handleSearchClick} />
        <Board />
      </div>
    </main>
  );
}
