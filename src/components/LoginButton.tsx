import { LoginRegisterModal } from "./LoginRegisiterModal.tsx";
import UserIcon from "/public/user.svg?react";
import { useToast } from "@/hooks/use-toast";
import type { RootState } from "../store.ts";
import { useSelector, useDispatch } from "react-redux";
import { updateModalOpen } from "../features/modalOpenSlice.ts";
import { updateLogin } from "../features/loginSlice.ts";
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../ultils/firebase.ts";

initializeApp(firebaseConfig);
const auth = getAuth();

export default function LoginButton() {
  const modalOpen = useSelector((state: RootState) => state.modalOpen.value);
  const login = useSelector((state: RootState) => state.login.value);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(updateLogin(false));
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

  return (
    <>
      {login ? (
        <button
          onClick={() => handleLogout()}
          className="absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-gray-900 hover:bg-gray-700"
        >
          <UserIcon className="lg:hidden" />
          <span className="hidden lg:block">Sign out</span>
        </button>
      ) : (
        <button
          onClick={() => dispatch(updateModalOpen(true))}
          className="absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-white/25 hover:bg-white/20 "
        >
          <UserIcon className="lg:hidden" />
          <span className="hidden lg:block">Sign in / Sign up</span>
        </button>
      )}
      {modalOpen && (
        <LoginRegisterModal onClose={() => dispatch(updateModalOpen(false))} />
      )}
    </>
  );
}
