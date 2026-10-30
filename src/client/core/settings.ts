// Local files and privacy modes can block storage; settings then just last for this page view.
export const readSetting = (key: string, fallback: string): string => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

export const saveSetting = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // See above: storage is optional.
  }
};
