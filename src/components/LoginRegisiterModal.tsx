import React from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { RootState } from "../store.ts";
import { useSelector, useDispatch } from "react-redux";
import GoogleIcon from "../assets/google.svg?react";
import { useToast } from "@/hooks/useToast.ts";
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
import { firebaseConfig } from "../utils/firebase.ts";
import { setUserData } from "@/api/getFirebaseData.ts";

initializeApp(firebaseConfig);
const auth = getAuth();

// 表單驗證 schema
const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼至少需要 8 個字符"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "姓名至少需要 2 個字符"),
  birthday: z.string().refine((date) => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(date)) {
      return false;
    }
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 檢查日期是否有效
    if (isNaN(parsedDate.getTime())) {
      return false;
    }

    // 確保只能輸入四個字
    const year = parsedDate.getFullYear();
    if (year < 1000 || year > 9999) {
      return false;
    }
    
    // 檢查是否超過今天的日期
    if (parsedDate > today) {
      return false;
    }
    
    
    // 檢查是否是一個合理的日期（例如：不是 13 月 32 日）
    const inputMonth = parsedDate.getMonth();
    const inputDate = parsedDate.getDate();
    const recreatedDate = new Date(parsedDate);
    recreatedDate.setMonth(inputMonth);
    recreatedDate.setDate(inputDate);
    
    return recreatedDate.getMonth() === inputMonth && recreatedDate.getDate() === inputDate;
  }, {
    message: "請輸入有效的生日",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼不一致",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface ModalProps {
  onClose: () => void;
}

export const LoginRegisterModal: React.FC<ModalProps> = ({ onClose }) => {
  const registerForm = useSelector(
    (state: RootState) => state.registerForm.value
  );
  const dispatch = useDispatch();
  const { toast } = useToast();
  const provider = new GoogleAuthProvider();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(registerForm ? registerSchema : loginSchema),
    mode: "onBlur"
  });

  //firebase google 登入功能
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email } = result.user;
      await setUserData(uid, email);
      dispatch(updateLogin(true));
      toast({
        description: "Google 登入成功！",
      });
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        description: `登入失敗：${errorMessage}`,
      });
    }
  };

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      if (registerForm) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const { uid } = userCredential.user;
        await setUserData(uid, data.email);
        const idToken = await userCredential.user.getIdToken();
        localStorage.setItem("token", idToken);
        dispatch(updateLogin(true));
        toast({
          description: "註冊成功！",
        });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        dispatch(updateLogin(true));
        toast({
          description: "登入成功！",
        });
      }
      reset();
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        description: `操作失敗：${errorMessage}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/25 backdrop-blur-sm z-50">
      <div className="w-72 lg:w-96 h-auto p-6 mx-8 bg-white/60 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">
          {registerForm ? "註冊" : "登入"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registerForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                {...register("name")}
                className="block w-full p-2 mt-1 border rounded-md"
                placeholder="請輸入姓名"
              />
              {(errors as FieldErrors<RegisterFormValues>).name && (
                <p className="text-red-500 text-sm">{(errors as FieldErrors<RegisterFormValues>).name?.message}</p>
              )}
            </div>
          )}

          {registerForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                生日
              </label>
              <input
                type="date"
                {...register("birthday")}
                className="block w-full p-2 mt-1 border rounded-md"
                max={new Date().toISOString().split('T')[0]} // 限制最大日期為今天
                min="1900-01-01" // 限制最小年份
                pattern="\d{4}-\d{2}-\d{2}" // 使用 YYYY-MM-DD 格式
              />
              {(errors as FieldErrors<RegisterFormValues>).birthday && (
                <p className="text-red-500 text-sm">{(errors as FieldErrors<RegisterFormValues>).birthday?.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              電子郵件
            </label>
            <input
              type="email"
              {...register("email")}
              className="block w-full p-2 mt-1 border rounded-md"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              密碼
            </label>
            <input
              type="password"
              {...register("password")}
              className="block w-full p-2 mt-1 border rounded-md"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {registerForm && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                確認密碼
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="block w-full p-2 mt-1 border rounded-md"
                placeholder="••••••••"
              />
              {(errors as FieldErrors<RegisterFormValues>).confirmPassword && (
                <p className="text-red-500 text-sm">
                  {(errors as FieldErrors<RegisterFormValues>).confirmPassword?.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white py-2 rounded-md bg-gray-900 hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? "處理中..." : (registerForm ? "註冊" : "登入")}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            <span className="text-gray-700 font-medium">
              使用 Google 登入
            </span>
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          {registerForm ? "已有帳號？" : "還沒有帳號？"}
          <button
            onClick={() => {
              reset();
              dispatch(updateRegisterForm(!registerForm));
            }}
            className="text-gray-900 hover:text-gray-600 ml-1"
          >
            {registerForm ? "登入" : "註冊"}
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
