export interface CountryCurrency {
  country: string;
  code: string; // ISO 3-letter currency code (e.g. INR, USD)
  countryCode: string; // ISO 2-letter country code (e.g. IN, US)
  symbol: string;
  flag: string;
  exchangeRate: number; // USD to local currency parity
  symbolPlacement: "prefix" | "suffix";
  roundTo: number; // Rounding granularity
  timezone: string;
}

export const COUNTRIES: CountryCurrency[] = [
  {
    country: "United States",
    code: "USD",
    countryCode: "US",
    symbol: "$",
    flag: "🇺🇸",
    exchangeRate: 1.0,
    symbolPlacement: "prefix",
    roundTo: 1,
    timezone: "America/New_York (EST -5:00)",
  },
  {
    country: "India",
    code: "INR",
    countryCode: "IN",
    symbol: "₹",
    flag: "🇮🇳",
    exchangeRate: 83.5,
    symbolPlacement: "prefix",
    roundTo: 100,
    timezone: "Asia/Kolkata (IST +5:30)",
  },
  {
    country: "European Union / Germany",
    code: "EUR",
    countryCode: "DE",
    symbol: "€",
    flag: "🇪🇺",
    exchangeRate: 0.92,
    symbolPlacement: "prefix",
    roundTo: 1,
    timezone: "Europe/Berlin (CET +1:00)",
  },
  {
    country: "United Kingdom",
    code: "GBP",
    countryCode: "GB",
    symbol: "£",
    flag: "🇬🇧",
    exchangeRate: 0.79,
    symbolPlacement: "prefix",
    roundTo: 1,
    timezone: "Europe/London (GMT +0:00)",
  },
  {
    country: "Canada",
    code: "CAD",
    countryCode: "CA",
    symbol: "CA$",
    flag: "🇨🇦",
    exchangeRate: 1.36,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "America/Toronto (EST -5:00)",
  },
  {
    country: "Australia",
    code: "AUD",
    countryCode: "AU",
    symbol: "A$",
    flag: "🇦🇺",
    exchangeRate: 1.52,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "Australia/Sydney (AEST +10:00)",
  },
  {
    country: "Japan",
    code: "JPY",
    countryCode: "JP",
    symbol: "¥",
    flag: "🇯🇵",
    exchangeRate: 155.0,
    symbolPlacement: "prefix",
    roundTo: 100,
    timezone: "Asia/Tokyo (JST +9:00)",
  },
  {
    country: "Singapore",
    code: "SGD",
    countryCode: "SG",
    symbol: "S$",
    flag: "🇸🇬",
    exchangeRate: 1.34,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "Asia/Singapore (SGT +8:00)",
  },
  {
    country: "United Arab Emirates",
    code: "AED",
    countryCode: "AE",
    symbol: "AED ",
    flag: "🇦🇪",
    exchangeRate: 3.67,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "Asia/Dubai (GST +4:00)",
  },
  {
    country: "Switzerland",
    code: "CHF",
    countryCode: "CH",
    symbol: "CHF ",
    flag: "🇨🇭",
    exchangeRate: 0.89,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "Europe/Zurich (CET +1:00)",
  },
  {
    country: "Brazil",
    code: "BRL",
    countryCode: "BR",
    symbol: "R$ ",
    flag: "🇧🇷",
    exchangeRate: 5.5,
    symbolPlacement: "prefix",
    roundTo: 5,
    timezone: "America/Sao_Paulo (BRT -3:00)",
  },
  {
    country: "South Africa",
    code: "ZAR",
    countryCode: "ZA",
    symbol: "R ",
    flag: "🇿🇦",
    exchangeRate: 18.2,
    symbolPlacement: "prefix",
    roundTo: 10,
    timezone: "Africa/Johannesburg (SAST +2:00)",
  },
];

export function findCountryCurrency(currencyCode?: string, countryName?: string): CountryCurrency {
  if (currencyCode) {
    const byCode = COUNTRIES.find((c) => c.code.toUpperCase() === currencyCode.toUpperCase());
    if (byCode) return byCode;
  }
  if (countryName) {
    const byCountry = COUNTRIES.find(
      (c) =>
        c.country.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(c.country.toLowerCase())
    );
    if (byCountry) return byCountry;
  }
  return COUNTRIES[0]; // fallback USD
}

export function getCurrencySymbol(currencyCode?: string, countryName?: string): string {
  const item = findCountryCurrency(currencyCode, countryName);
  return item.symbol.trim();
}

export function formatMoney(
  amount: number,
  currencyCode?: string,
  countryName?: string,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number; compact?: boolean }
): string {
  const item = findCountryCurrency(currencyCode, countryName);
  const symbol = item.symbol;
  const isPrefix = item.symbolPlacement === "prefix";

  if (options?.compact && Math.abs(amount) >= 1000) {
    let formatted = "";
    if (Math.abs(amount) >= 10000000 && item.code === "INR") {
      formatted = (amount / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
    } else if (Math.abs(amount) >= 100000 && item.code === "INR") {
      formatted = (amount / 100000).toFixed(1).replace(/\.0$/, "") + "L";
    } else if (Math.abs(amount) >= 1000000) {
      formatted = (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    } else {
      formatted = (amount / 1000).toFixed(0) + "k";
    }
    return isPrefix ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
  }

  const minDec = options?.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 2;
  const maxDec = options?.maximumFractionDigits !== undefined ? options.maximumFractionDigits : 2;

  const locale = item.code === "INR" ? "en-IN" : "en-US";
  const numStr = Number(amount || 0).toLocaleString(locale, {
    minimumFractionDigits: minDec,
    maximumFractionDigits: maxDec,
  });

  return isPrefix ? `${symbol}${numStr}` : `${numStr} ${symbol}`;
}

export function formatPlanPrice(
  usdPrice: number,
  currencyCode?: string,
  countryName?: string
): string {
  const item = findCountryCurrency(currencyCode, countryName);
  if (usdPrice === 0) {
    return item.symbolPlacement === "prefix" ? `${item.symbol}0` : `0 ${item.symbol}`;
  }
  const raw = usdPrice * item.exchangeRate;
  const rounded = Math.round(raw / item.roundTo) * item.roundTo;
  const locale = item.code === "INR" ? "en-IN" : "en-US";
  const formattedNum = rounded.toLocaleString(locale);
  return item.symbolPlacement === "prefix"
    ? `${item.symbol}${formattedNum}`
    : `${formattedNum} ${item.symbol}`;
}
