import { useSelector, useDispatch } from "react-redux";
import { updateQuery } from "../features/querySlice.ts";
import { updateHistoryList } from "../features/historyListSlice.ts";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../ultils/firebase.ts";
import { getHistory } from "@/api/getFirebaseData.ts";
import { RootState } from "@/store.ts";

initializeApp(firebaseConfig);
const auth = getAuth();

export function HistoryList() {
  const historyList = useSelector(
    (state: RootState) => state.historyList.value
  );
  const login = useSelector((state: RootState) => state.login.value);
  const dispatch = useDispatch();

  const handleHistoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const value = target.getAttribute("data-value");
    if (value) {
      dispatch(updateQuery(value));
    }
  };

  const findTopHistory = (list: string[]) => {
    const topHistory: string[] = [];
    for (let i = list.length - 1; i >= 0; i--) {
      if (topHistory.includes(list[i])) {
        continue;
      }
      topHistory.push(list[i]);
      if (topHistory.length === 5) {
        break;
      }
    }
    return topHistory;
  };

  const user = auth.currentUser;
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

  return (
    <div className="flex w-full h-auto px-8">
      {login && historyList &&
        historyList.map((item: string) => (
          <div
            key={item}
            onClick={handleHistoryClick}
            data-value={item}
            className="px-2 mr-3 text-white border-white/25 hover:bg-white/20 backdrop-blur-md border-2 rounded-md shadow-lg cursor-pointer"
          >
            {item}
          </div>
        ))}
    </div>
  );
}
