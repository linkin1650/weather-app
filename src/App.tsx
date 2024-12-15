import Board from "./components/Board";
import SearchBar from "./components/SearchBar";
import { ForecastDay } from "./types/type";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store.ts";
import { updateCityWeather } from "./features/cityWeatherSlice.ts";
import { updateLoading } from "./features/loadingSlice.ts";
import { updateProgress } from "./features/progressSlice.ts";
import { getCityWeather } from "./api/getData.ts";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import LoginButton from "./components/LoginButton.tsx";

export default function App() {
  const query = useSelector((state: RootState) => state.query.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const progress = useSelector((state: RootState) => state.progress.value);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSearchClick = async () => {
    //若 query 為空，不執行後續動作
    if (!query) {
      return;
    }

    try {
      dispatch(updateLoading(true));
      dispatch(updateProgress(13));
      //調用 api
      const data = await getCityWeather(query);
      //使用 redux toolkit 更新 CityWeather

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

      dispatch(updateProgress(100));
    } catch (error) {
      //找不到城市資料時顯示
      toast({
        description: "Whoops: can't find the city, please try again",
      });
      dispatch(updateLoading(false));
      console.error(error);
    }
  };

  return (
    <main className="relative flex justify-center h-screen">
      <div className="absolute top-0 left-0 -z-50 w-full h-full overflow-hidden">
        <video
          className="fixed top-0 left-0 h-full w-full aspect-video object-cover contrast-75"
          autoPlay
          muted
          loop
        >
          <source src="/night.mp4"></source>
        </video>
      </div>
      <LoginButton />
      <div className="flex flex-col w-full max-w-sm md:max-w-md lg:max-w-3xl">
        <SearchBar handleSearchClick={handleSearchClick} />
        <div className={`flex justify-center items-center w-full h-1/2 px-8 ${loading ? "block" : "hidden"}`}>
          <Progress
            value={progress}
            onComplete={() => {
              dispatch(updateLoading(false)); // 動畫完成後切換 loading 狀態
              dispatch(updateProgress(13)); // 重置進度條
            }}
          />
        </div>
        {!loading && <Board />}
      </div>
    </main>
  );
}
