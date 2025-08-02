import { useEffect, useState } from "react";

export const useDebounce = (value: string): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    if (value === "") {
      setDebouncedValue("");
      return;
    }
    const handler = setTimeout(() => setDebouncedValue(value), 500);
    return () => clearTimeout(handler);
  }, [value]);
  return debouncedValue;
};
