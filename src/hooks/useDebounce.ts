import { useState, useEffect } from "react";

//設定 Debounce function
export default function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  //依賴 value 變化
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
