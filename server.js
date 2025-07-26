// server.js
const express = require('express');
const fetch = require('node-fetch');  // 確保是 node-fetch v2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = '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';

app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();  // 先讀成文字
    try {
      const data = JSON.parse(text);  // 嘗試轉成 JSON
      res.json(data);
    } catch {
      console.error('非 JSON 回傳:', text);
      res.status(500).send('API 回傳非 JSON 資料，內容看 console');
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    res.status(500).json({ error: 'OpenRouter API 呼叫失敗' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
