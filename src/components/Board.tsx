import CurrentWeather from "./CurrentWeather";
import ForecastsWeather from "./ForecastsWeather";
import HintBoard from "./HintBoard.tsx";
import { useSelector, useDispatch } from "react-redux";
import { updateVisible } from "../features/visibleSlice.ts";
import type { RootState } from "../store.ts";
import { useEffect } from "react";

export default function Board() {
  const cityWeather = useSelector(
    (state: RootState) => state.cityWeather.value
  );
  const visible = useSelector((state: RootState) => state.visible.value);
  const dispatch = useDispatch();

  //設定透明度動畫，以 useEffect 確保每一次 cityWeather 更新時，會執行一次 opacity-0 至 opacity-100
  useEffect(() => {
    dispatch(updateVisible(0));
    let start: number | null = null;
    const duration = 500;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const visibility = Math.min(100, (progress / duration) * 100);
      dispatch(updateVisible(visibility));
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [cityWeather]);

  return (
    <div
      className={`flex justify-center w-full h-auto px-8 mt-6 transition-opacity duration-1000 ease-in-out opacity-${visible}`}
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
