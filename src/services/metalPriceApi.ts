// Simple metals pricing + FX helpers

const GOLD_PRICE_URL = 'https://api.gold-api.com/price/XAU';
const USD_INR_URL = 'https://api.exchangerate.host/latest?base=USD&symbols=INR';

const TROY_OUNCE_TO_GRAMS = 31.1034768;

export interface GoldPriceResponse {
  name: string;
  price: number; // USD per troy ounce
  symbol: string; // XAU
  updatedAt: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function getGoldUsdPerOunce(): Promise<number> {
  const data = await fetchJson<GoldPriceResponse>(GOLD_PRICE_URL);
  return data.price; // USD per troy ounce
}

export async function getUsdInrRate(): Promise<number> {
  const data = await fetchJson<{ base: string; rates: { INR: number } }>(USD_INR_URL);
  return data.rates.INR;
}

export async function getGoldInrPerGram(): Promise<number> {
  const [usdPerOz, usdInr] = await Promise.all([getGoldUsdPerOunce(), getUsdInrRate()]);
  const inrPerOz = usdPerOz * usdInr;
  const inrPerGram = inrPerOz / TROY_OUNCE_TO_GRAMS;
  return inrPerGram;
}


