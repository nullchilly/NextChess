import { useState, useEffect } from 'react';

type Args<T> = {
  name: string;
  defaultValue: T;
};

export function useLocalStorage<T>(args: Args<T>): [T, (arg: T) => void, () => void] {
  const { defaultValue, name } = args;
  const [value, setValue] = useState<T | undefined>(undefined);
  const persistenceKey = `@stockchess/useLocalStorage/${name}`;

  useEffect(function didMount() {
    if (isLocalStorageAvailable()) {
      const persistedState = localStorage.getItem(persistenceKey);
      if (persistedState) {
        setValue(JSON.parse(persistedState));
      } else {
        // setValue(defaultValue);
        // setValue()
      }
    }
  }, []);

  useEffect(
    function persistOnChange() {
      if (isLocalStorageAvailable() && value !== undefined)
        localStorage.setItem(persistenceKey, JSON.stringify(value));
    },
    [value]
  );

  function removeValue() {
    if (isLocalStorageAvailable()) localStorage.removeItem(persistenceKey);
  }

  return [value ?? defaultValue, setValue, removeValue];
}

export function isLocalStorageAvailable(): boolean {
  try {
    if (!window.localStorage || localStorage === null || typeof localStorage === 'undefined') {
      return false;
    }

    localStorage.setItem('localStorage:test', 'value');
    if (localStorage.getItem('localStorage:test') !== 'value') {
      return false;
    }
    localStorage.removeItem('localStorage:test');
    return true;
  } catch {
    return false;
  }
}
