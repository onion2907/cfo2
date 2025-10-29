// Simple test script to check Alpha Vantage API
const API_KEY = 'VM94VYHT0VVANCC6';
const BASE_URL = 'https://www.alphavantage.co/query';

async function testAPI() {
  console.log('Testing Alpha Vantage API...');
  
  // Test 1: Stock Search
  console.log('\n1. Testing Stock Search...');
  try {
    const searchUrl = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=AAPL&apikey=${API_KEY}`;
    console.log('Search URL:', searchUrl);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    console.log('Search Response:', JSON.stringify(searchData, null, 2));
  } catch (error) {
    console.error('Search Error:', error);
  }

  // Test 2: Exchange Rate
  console.log('\n2. Testing Exchange Rate...');
  try {
    const rateUrl = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${API_KEY}`;
    console.log('Rate URL:', rateUrl);
    
    const rateResponse = await fetch(rateUrl);
    const rateData = await rateResponse.json();
    console.log('Rate Response:', JSON.stringify(rateData, null, 2));
  } catch (error) {
    console.error('Rate Error:', error);
  }

  // Test 3: Stock Quote
  console.log('\n3. Testing Stock Quote...');
  try {
    const quoteUrl = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${API_KEY}`;
    console.log('Quote URL:', quoteUrl);
    
    const quoteResponse = await fetch(quoteUrl);
    const quoteData = await quoteResponse.json();
    console.log('Quote Response:', JSON.stringify(quoteData, null, 2));
  } catch (error) {
    console.error('Quote Error:', error);
  }
}

testAPI().catch(console.error);
