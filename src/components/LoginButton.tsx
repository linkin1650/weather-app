import { LoginRegisterModal } from "./LoginRegisiterModal.tsx";
import UserIcon from "../assets/user.svg?react";
import LogoutIcon from "../assets/logout.svg?react";
import { useToast } from "@/hooks/use-toast";
import type { RootState } from "../store.ts";
import { useSelector, useDispatch } from "react-redux";
import { updateModalOpen } from "../features/modalOpenSlice.ts";
import { updateLogin } from "../features/loginSlice.ts";
import { updateHistoryList } from "../features/historyListSlice.ts";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../ultils/firebase.ts";
import { useEffect } from "react";

initializeApp(firebaseConfig);
const auth = getAuth();

export default function LoginButton() {
  const modalOpen = useSelector((state: RootState) => state.modalOpen.value);
  const login = useSelector((state: RootState) => state.login.value);
  const dispatch = useDispatch();
  const { toast } = useToast();

  //處理登出
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("token");
        dispatch(updateLogin(false));
        //清空歷史紀錄欄位
        dispatch(updateHistoryList([]));
        toast({
          description: "Signout successfully!",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          description: `Whoops...something wrong!. errorcode: ${errorCode}, errormessage: ${errorMessage}`,
        });
      });
  };

  //處理確認目前 localStorage 是否有登入憑證，避免重新整理時需要重新登入
  useEffect(() => {
    // 檢查用戶的登入狀態
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 獲取並驗證 Token
          const idToken = await user.getIdToken();
          // 儲存 Token 到 localStorage
          localStorage.setItem("token", idToken);

          // 更新應用登入狀態
          dispatch(updateLogin(true));
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // 如果有錯誤，登出用戶
          signOut(auth)
            .then(() => {
              localStorage.removeItem("token");
              dispatch(updateLogin(false));
              dispatch(updateHistoryList([]));
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast({
                description: `Whoops...something wrong!. errorcode: ${errorCode}, errormessage: ${errorMessage}`,
              });
            });
        }
      } else {
        // 如果有錯誤，登出用戶
        signOut(auth)
          .then(() => {
            localStorage.removeItem("token");
            dispatch(updateLogin(false));
            dispatch(updateHistoryList([]));
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast({
              description: `Whoops...something wrong!. errorcode: ${errorCode}, errormessage: ${errorMessage}`,
            });
          });
      }
    });

    return () => unsubscribe(); // 清理監聽器
  }, [auth]);

  return (
    <>
      {/* 根據 login 狀態渲染登出或登入 button */}
      {login ? (
        <button
          onClick={() => handleLogout()}
          className="flex absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-gray-900 hover:bg-gray-700"
        >
          <LogoutIcon className="lg:hidden mr-2" />
          <span className="sm:hidden lg:block">Sign out</span>
        </button>
      ) : (
        <button
          onClick={() => dispatch(updateModalOpen(true))}
          className="flex absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-white/25 hover:bg-white/20 "
        >
          <UserIcon className="lg:hidden mr-2" />
          <span className="sm:hidden lg:block">Sign in / Sign up</span>
        </button>
      )}
      {/* 根據 modalOpen 渲染登入 modal */}
      {modalOpen && (
        <LoginRegisterModal onClose={() => dispatch(updateModalOpen(false))} />
      )}
    </>
  );
}
