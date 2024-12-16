import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../ultils/firebase.ts";
import { getDatabase, ref, set, push, child, get } from "firebase/database";

// 使用者的資料型別
interface User {
  email: string | null;
  history: string[]; // history 是一個包含 string 的陣列
}

initializeApp(firebaseConfig);

export function setUserData(userId: string, email: string | null): void {
  const db = getDatabase();
  const path = `users/${userId}`;
  const userRef = ref(db, path);
  const userData: User = {
    email: email,
    history: [],
  };
  set(userRef, userData);
}

export function updateHistory(userId: string, searchQuery: string): void {
  const db = getDatabase();
  const path = `users/${userId}/history`;
  const historyRef = ref(db, path);

  push(historyRef, searchQuery);
}

export function getHistory(userId: string): Promise<Record<string, string>> {
  const dbRef = ref(getDatabase());
  const path = `users/${userId}/history`;

  return get(child(dbRef, path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
