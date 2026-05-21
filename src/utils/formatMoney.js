// Formats a number as Russian locale: space thousands separator, comma decimal.
// e.g. 1234.56 → "1 234,56",  54.04 → "54,04",  1000 → "1 000"
export function formatMoney(n) {
  return (Math.round(n * 100) / 100).toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
