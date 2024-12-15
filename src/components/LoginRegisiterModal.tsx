import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import type { RootState } from "../store.ts";
import { useSelector, useDispatch } from "react-redux";
import GoogleIcon from "/public/google.svg?react";
import { useToast } from "@/hooks/use-toast";
import { updateRegisterForm } from "../features/registerFormSlice.ts";
import { updateLogin } from "../features/loginSlice.ts";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../ultils/firebase.ts";
import { setUserData } from "@/api/getFirebaseData.ts";

initializeApp(firebaseConfig);
const auth = getAuth();

type FormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

interface ModalProps {
  onClose: () => void;
}

export const LoginRegisterModal: React.FC<ModalProps> = ({ onClose }) => {
  const registerForm = useSelector(
    (state: RootState) => state.registerForm.value
  );
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const { toast } = useToast();
  const password = watch("password"); // 監視密碼欄位，以便確認密碼比對
  const provider = new GoogleAuthProvider();

  //firebase google 登入功能
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const { uid, email } = user;
        setUserData(uid, email);
        dispatch(updateLogin(true));
        toast({
          description: "Signed in with Google successfully!",
        });
        onClose();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          description: `Whoops...Failed to sign in with Google. errorcode: ${errorCode}, errormessage: ${errorMessage}`,
        });
      });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;

    //用 registerFrom 狀態區分表格 onSubmit
    if (registerForm) {
      //firebase註冊功能
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUserData(user.uid, email);
          console.log(user);
          dispatch(updateLogin(true));
          toast({
            description: "Signup successfully!",
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast({
            description: `Whoops...something wrong! errorcode: ${errorCode}, errormessage: ${errorMessage}`,
          });
        });
    } else {
      //firebase登入功能
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          dispatch(updateLogin(true));
          toast({
            description: "Login successfully!",
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast({
            description: `Whoops...something wrong! errorcode: ${errorCode}, errormessage: ${errorMessage}`,
          });
        });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/25 backdrop-blur-sm z-50">
      <div className="bg-white/60 p-6 mx-8 rounded-lg shadow-lg w-72 lg:w-96 h-auto">
        <h2 className="text-xl font-bold text-center mb-4">
          {registerForm ? "Sign up" : "Sign in"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "please enter email" })}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Please enter password" })}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {registerForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "The passwords do not match", // 驗證密碼一致性
                })}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white py-2 rounded-md bg-gray-900 hover:bg-gray-800 transition"
          >
            {registerForm ? "Sign up" : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-700 mb-2"></p>
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          {registerForm ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => dispatch(updateRegisterForm(!registerForm))}
            className="text-gray-900 hover:text-gray-600 ml-1"
          >
            {registerForm ? "Sign in" : "Sign up"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
