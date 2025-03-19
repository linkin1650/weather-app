import { useSelector, useDispatch } from "react-redux";
import { updateQuery } from "../features/querySlice.ts";
import { updateHistoryList } from "../features/historyListSlice.ts";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../utils/firebase.ts";
import { getHistory } from "@/api/getFirebaseData.ts";
import { RootState } from "@/store.ts";
import { useEffect } from "react";

initializeApp(firebaseConfig);
const auth = getAuth();

export function HistoryList() {
  const historyList = useSelector(
    (state: RootState) => state.historyList.value
  );
  const login = useSelector((state: RootState) => state.login.value);
  const loading = useSelector((state: RootState) => state.loading.value);
  const dispatch = useDispatch();

  // 處理 history 被點擊時
  const handleHistoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 取得 div 裡面的 data-value 屬性
    const value = target.getAttribute("data-value");
    // 更新 Query
    if (value) {
      dispatch(updateQuery(value));
    }
  };

  // 找到最新的五個歷史紀錄，且不重複
  const findTopHistory = (list: string[]) => {
    const topHistory: string[] = [];
    for (let i = list.length - 1; i >= 0; i--) {
      // 若已在 topHistory 中，則跳過
      if (topHistory.includes(list[i])) {
        continue;
      }
      topHistory.push(list[i]);
      // 達到 5 個時跳出迴圈
      if (topHistory.length === 5) {
        break;
      }
    }
    return topHistory;
  };

  // 取得目前登入者資料
  const user = auth.currentUser;

  // 監聽 loading 變更時，再拿一次 historyList
  useEffect(() => {
    if (user && login) {
      getHistory(user.uid)
        .then((data) => {
          const historyList: string[] = Object.values(data);
          dispatch(updateHistoryList(findTopHistory(historyList)));
        })
        .catch((error) => {
          console.error("Failed to fetch history:", error);
        });
    }
  }, [user, loading]);

  return (
    <div className="flex flex-wrap w-full h-auto px-8">
      {login &&
        historyList &&
        historyList.map((item: string) => (
          <div
            key={item}
            onClick={handleHistoryClick}
            data-value={item}
            className="px-2 mb-2 mr-3 text-white border-white/25 hover:bg-white/20 backdrop-blur-md border-2 rounded-md shadow-lg cursor-pointer"
          >
            {item}
          </div>
        ))}
    </div>
  );
}
