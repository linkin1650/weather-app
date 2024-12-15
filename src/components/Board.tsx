import CurrentWeather from "./CurrentWeather";
import ForecastsWeather from "./ForecastsWeather";
import HintBoard from "./HintBoard.tsx";
import { useSelector, useDispatch } from "react-redux";
import { updateVisibled } from "../features/visibledSlice.ts";
import type { RootState } from "../store.ts";
import { useEffect } from "react";

export default function Board() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );
  const visibled = useSelector((state: RootState) => state.visibled.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateVisibled(0));
    const timer = setTimeout(() => {
      dispatch(updateVisibled(100));
    }, 500);
    return () => clearTimeout(timer);
  }, [cityWeather]);

  return (
    <div
      className={`flex justify-center w-full h-auto px-8 mt-12 transition-opacity duration-1000 ease-in-out opacity-${visibled}`}
    >
      <section className="flex flex-col lg:flex-row justify-between w-full h-full">
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
