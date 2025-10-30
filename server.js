import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Lightweight proxy to avoid browser CORS for external price APIs
app.get('/api/metal/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const upstream = `https://api.gold-api.com/price/${encodeURIComponent(symbol)}`;
    const r = await fetch(upstream);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'metal_proxy_failed' });
  }
});

app.get('/api/fx/usd-inr', async (_req, res) => {
  try {
    const upstream = 'https://api.exchangerate.host/latest?base=USD&symbols=INR';
    const r = await fetch(upstream);
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: 'fx_proxy_failed' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
