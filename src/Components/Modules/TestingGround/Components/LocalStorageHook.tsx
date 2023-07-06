import React, { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  storageKey: string,
  fallbackState: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(storageKey);
    /* return storedValue ? JSON.parse(storedValue) : fallbackState; */
    return storedValue ? (JSON.parse(storedValue) as T) : fallbackState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}

