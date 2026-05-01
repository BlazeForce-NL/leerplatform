"use client";

import { useState } from "react";
import { getStorageItem, setStorageItem } from "./storage";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => getStorageItem(key, initialValue));

  const updateValue = (nextValue: T) => {
    setValue(nextValue);
    setStorageItem(key, nextValue);
  };

  return [value, updateValue] as const;
}
