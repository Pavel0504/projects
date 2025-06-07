import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS для фронтенда (можно сузить до конкретного домена)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Общий проксирующий маршрут для amoCRM API
app.use('/amocrm', async (req, res) => {
  const path = req.url; // например '/leads?limit=50'
  const url = `https://${process.env.AMO_SUBDOMAIN}.amocrm.ru/api/v4${path}`;

  try {
    const apiRes = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${process.env.AMO_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const body = await apiRes.text();
    res.status(apiRes.status).send(body);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});