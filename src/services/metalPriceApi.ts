// Simple metals pricing + FX helpers

const BASE_PRICE_URL = 'https://api.gold-api.com/price';
const USD_INR_URL = 'https://api.exchangerate.host/latest?base=USD&symbols=INR';

const TROY_OUNCE_TO_GRAMS = 31.1034768;

export interface PriceResponse {
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

export async function getUsdPrice(symbol: 'XAU' | 'XAG' | 'BTC' | 'ETH'): Promise<number> {
  const url = `${BASE_PRICE_URL}/${symbol}`;
  const data = await fetchJson<PriceResponse>(url);
  return data.price;
}

export async function getUsdInrRate(): Promise<number> {
  const data = await fetchJson<{ base: string; rates: { INR: number } }>(USD_INR_URL);
  return data.rates.INR;
}

export async function getGoldInrPerGram(): Promise<number> {
  const [usdPerOz, usdInr] = await Promise.all([getUsdPrice('XAU'), getUsdInrRate()]);
  const inrPerOz = usdPerOz * usdInr;
  const inrPerGram = inrPerOz / TROY_OUNCE_TO_GRAMS;
  return inrPerGram;
}

export async function getSilverInrPerGram(): Promise<number> {
  const [usdPerOz, usdInr] = await Promise.all([getUsdPrice('XAG'), getUsdInrRate()]);
  const inrPerOz = usdPerOz * usdInr;
  const inrPerGram = inrPerOz / TROY_OUNCE_TO_GRAMS;
  return inrPerGram;
}

export async function getCryptoInrPerUnit(symbol: 'BTC' | 'ETH'): Promise<number> {
  const [usdPerUnit, usdInr] = await Promise.all([getUsdPrice(symbol), getUsdInrRate()]);
  return usdPerUnit * usdInr;
}


