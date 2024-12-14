import { useSelector } from "react-redux";
import type { RootState } from "../store.ts";

export default function DayWeather() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );

  if (!cityWeather) {
    return
  }

  return (
    <div className="flex justify-around items-center w-full h-20 lg:h-1/6 mt-2 bg-white/25 hover:bg-white/20 backdrop-blur-md border-0 rounded-md shadow-lg transition-colors">
      <p>12/13</p>
      <img src="https://fakeimg.pl/25x25/" className="w-6 h-6"></img>
      <p>12-25 &#8451;</p>
    </div>
  );
}
