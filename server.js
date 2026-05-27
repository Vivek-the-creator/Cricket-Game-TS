const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Endpoint to fetch scores
app.get('/api/scores', (req, res) => {
  const filePath = path.join(__dirname, 'scores.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read scores file' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse scores.json' });
    }
  });
});

// Endpoint to save scores
app.post('/api/scores', (req, res) => {
  const filePath = path.join(__dirname, 'scores.json');
  const scoresData = req.body;

  if (scoresData === undefined || typeof scoresData.highestScore !== 'number' || !Array.isArray(scoresData.games)) {
    return res.status(400).json({ error: 'Invalid score data structure' });
  }

  fs.writeFile(filePath, JSON.stringify(scoresData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing to scores.json:', err);
      return res.status(500).json({ error: 'Failed to write scores file' });
    }
    console.log('Successfully saved scores to scores.json');
    res.json({ success: true, message: 'Scores saved successfully', data: scoresData });
  });
});

// Fallback: serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🏏 Hand Cricket Dev Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`==================================================`);
});
