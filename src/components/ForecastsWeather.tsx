import { useSelector } from "react-redux";
import type { RootState } from "../store.ts";
import { ForecastDay } from "../types/type.ts";

export default function ForecastsWeather() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );

  if (!cityWeather) {
    return null;
  }

  console.log(cityWeather.forecast);

  return (
    <div className="flex flex-col justify-between items-center w-full lg:w-2/6 h-full">
      <p className="text-lg text-black font-bold">5 DAYS FORECASTS</p>
      {cityWeather.forecast.forecastday.map((forecastDay: ForecastDay) => (
        <div
          key={forecastDay.date}
          className="flex justify-around items-center w-full h-20 lg:h-full mt-2 bg-white/25 hover:bg-white/20 backdrop-blur-md border-0 rounded-md shadow-lg transition-colors"
        >
          <p className="text-center w-2/5">{forecastDay.date}</p>
          <img
            src={forecastDay.day.condition.icon}
            alt="Weather icon"
            className="w-6 h-6"
          ></img>
          <p className="text-center w-2/5">
            {forecastDay.day.mintemp_c} - {forecastDay.day.maxtemp_c} &#8451;
          </p>
        </div>
      ))}
    </div>
  );
}
