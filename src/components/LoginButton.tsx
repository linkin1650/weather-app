import { useState } from "react";
import { LoginRegisterModal } from "./LoginResiterModal";
import UserIcon from "/public/user.svg?react";

export default function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute z-30 top-4 sm:top-8 sm:right-4 px-2 py-1 text-white rounded-sm bg-white/25 hover:bg-white/20"
      >
        <UserIcon className="lg:hidden" />
        <span className="hidden lg:block">Sign in / Sign up</span>
      </button>

      {isModalOpen && (
        <LoginRegisterModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
