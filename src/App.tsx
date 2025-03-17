import Board from "./components/Board.tsx";
import SearchBar from "./components/SearchBar.tsx";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store.ts";
import { updateLoading } from "./features/loadingSlice.ts";
import { updateProgress } from "./features/progressSlice.ts";
import { Progress } from "@/components/ui/progress";
import LoginButton from "./components/LoginButton.tsx";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./ultils/firebase.ts";
import { HistoryList } from "./components/HistoryList.tsx";

//初始化 firebase
initializeApp(firebaseConfig);

export default function App() {
  const loading = useSelector((state: RootState) => state.loading.value);
  const progress = useSelector((state: RootState) => state.progress.value);
  const dispatch = useDispatch();

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
        <SearchBar />
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
