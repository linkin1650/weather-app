import { LoginRegisterModal } from "./LoginResiterModal";
import UserIcon from "/public/user.svg?react";
import type { RootState } from "../store.ts";
import { useSelector, useDispatch } from "react-redux";
import { updateModalOpen } from "../features/modalOpenSlice.ts";

export default function LoginButton() {
  const modalOpen = useSelector((state: RootState) => state.modalOpen.value);
  const dispatch = useDispatch();

  return (
    <>
      <button
        onClick={() => dispatch(updateModalOpen(true))}
        className="absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-white/25 hover:bg-white/20"
      >
        <UserIcon className="lg:hidden" />
        <span className="hidden lg:block">Sign in / Sign up</span>
      </button>

      {modalOpen && (
        <LoginRegisterModal onClose={() => dispatch(updateModalOpen(false))} />
      )}
    </>
  );
}
