import CurrentWeather from "./CurrentWeather";
import ForecastsWeather from "./ForecastsWeather";
import HintBoard from "./HintBoard.tsx"
import { useSelector } from "react-redux";
import type { RootState } from "../store.ts";

export default function Board() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );

  return (
    <div className="flex justify-center w-full h-auto mt-12">
      <section className="flex flex-col lg:flex-row justify-between w-full h-full ">
        {cityWeather ? (
          <>
            <CurrentWeather />
            <ForecastsWeather />
          </>
        ) : (
          <HintBoard />
        )}
      </section>
    </div>
  );
}
