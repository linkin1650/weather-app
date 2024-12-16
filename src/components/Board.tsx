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

  //設定透明度動畫，以 useEffect 確保每一次 cityWeather 更新時，會執行一次 opacity-0 至 opacity-100
  useEffect(() => {
    dispatch(updateVisibled(0));
    const timer = setTimeout(() => {
      dispatch(updateVisibled(100));
    }, 500);
    return () => clearTimeout(timer);
  }, [cityWeather]);

  return (
    <div
      className={`flex justify-center w-full h-auto px-8 mt-6 transition-opacity duration-1000 ease-in-out opacity-${visibled}`}
    >
      <section className="flex flex-col lg:flex-row justify-between w-full h-full">
        {/* 按照 cityWeather 內是否有資料，決定要渲染天氣資料或是初始提示區塊 */}
        {cityWeather ? (
          <>
            <CurrentWeather />
            <ForecastsWeather />
          </>
        ) : (
          // 初始提示
          <HintBoard />
        )}
      </section>
    </div>
  );
}
