import Board from "./components/Board.tsx";
import SearchBar from "./components/SearchBar.tsx";
import { ForecastDay } from "./types/type";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store.ts";
import { updateCityWeather } from "./features/cityWeatherSlice.ts";
import { updateLoading } from "./features/loadingSlice.ts";
import { updateProgress } from "./features/progressSlice.ts";
import { getCityWeather } from "./api/getData.ts";
import { useToast } from "@/hooks/useToast.ts";
import { Progress } from "@/components/ui/progress";
import LoginButton from "./components/LoginButton.tsx";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./ultils/firebase.ts";
import { updateHistory } from "./api/getFirebaseData.ts";
import { HistoryList } from "./components/HistoryList.tsx";

//初始化 firebase
initializeApp(firebaseConfig);
const auth = getAuth();

export default function App() {
  const query = useSelector((state: RootState) => state.query.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const progress = useSelector((state: RootState) => state.progress.value);
  const dispatch = useDispatch();
  const { toast } = useToast();

  //處理搜尋按鈕被點擊
  const handleSearchClick = async () => {
    //若 query 為空，不執行後續動作
    if (!query) {
      return;
    }

    try {
      //將 loading 改成 true，觸發載入動畫
      dispatch(updateLoading(true));
      //將 Progress 改成 0，初始化載入動畫的值 (載入動畫以輸入數值表示進度，)
      dispatch(updateProgress(0));
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

      //確認目前是否有登入者，若登入者存在，將記錄存到 db
      const user = auth.currentUser;
      if (user) {
        updateHistory(user.uid, data.location.name);
      }

      //將 Progress 改成 100，完成進度條動畫
      dispatch(updateProgress(100));
    } catch (error) {
      //找不到城市資料時顯示
      toast({
        description: `Whoops: can't find the city, please try again! ${error}`,
      });
      //退出 loading 狀態
      dispatch(updateLoading(false));
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
          preload="auto"
        >
          <source src="/night.mp4"></source>
        </video>
      </div>
      <LoginButton />
      <div className="flex flex-col w-full max-w-sm md:max-w-md lg:max-w-3xl">
        <SearchBar handleSearchClick={handleSearchClick} />
        <HistoryList />
        <div
          className={`flex justify-center items-center w-full h-1/2 px-8 ${
            loading ? "block" : "hidden"
          }`}
        >
          <Progress
            value={progress}
            onComplete={() => {
              dispatch(updateLoading(false)); // 動畫完成後切換 loading 狀態
              dispatch(updateProgress(0)); // 重置進度條
            }}
          />
        </div>
        {/* 非 loading 狀態時渲染 Board */}
        {!loading && <Board />}
      </div>
    </main>
  );
}
