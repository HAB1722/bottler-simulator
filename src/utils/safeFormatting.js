// Safe formatting utilities
export const safeToLocaleString = (value, fallback = "0") => {
  // Handle null, undefined, NaN, and non-numeric values
  if (value == null || isNaN(value) || typeof value !== 'number') {
    return fallback;
  }
  return value.toLocaleString();
};

export const safeCurrency = (value, fallback = "$0") => {
  if (value == null || isNaN(value) || typeof value !== 'number') {
    return fallback;
  }
  return `$${value.toLocaleString()}`;
};

export const safePercentage = (value, fallback = "0%") => {
  if (value == null || isNaN(value) || typeof value !== 'number') {
    return fallback;
  }
  return `${value.toFixed(1)}%`;
};

export const safeNumber = (value, fallback = 0) => {
  if (value == null || isNaN(value) || typeof value !== 'number') {
    return fallback;
  }
  return value;
};