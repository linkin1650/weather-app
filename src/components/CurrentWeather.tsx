import { useSelector } from "react-redux";
import type { RootState } from "../store.ts";

export default function CurrentWeather() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );

  if (!cityWeather) {
    return null;
  }

  return (
    <div className={`flex flex-col w-full lg:w-3/5 h-full justify-around items-center bg-white/25 hover:bg-white/20 backdrop-blur-md border-0 rounded-md shadow-lg transition-colors`}>
      <p className="py-3 text-base font-sm">{cityWeather.location.localtime}</p>
      <div>
        <h2 className="text-center w-auto pb-5 px-6 text-5xl font-bold tracking-wide shrink">
          {cityWeather.location.name}
        </h2>
        <p className="text-center">{cityWeather.location.country}</p>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={cityWeather.current.condition.icon}
          className="w-28 h-28"
        ></img>
        <p className="text-base mt-2">{cityWeather.current.condition.text}</p>
      </div>
      <div className="flex flex-col items-center my-5">
        <p className="text-6xl font-bold">{cityWeather.current.temp_c} &#8451;</p>
      </div>
    </div>
  );
}
