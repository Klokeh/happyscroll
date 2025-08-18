const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];
let currentIndex = 0;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper: get new access token using refresh token
async function getAccessToken() {
  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN,
    }),
    {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
      headers: {
        'User-Agent': process.env.USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data.access_token;
}

// Fetch saved posts
async function fetchSaved() {
  const accessToken = await getAccessToken();
  const response = await axios.get(
    'https://oauth.reddit.com/user/me/saved?limit=100',
    {
      headers: {
        Authorization: `bearer ${accessToken}`,
        'User-Agent': process.env.USER_AGENT,
      },
    }
  );
  savedPosts = response.data.data.children.filter(item => item.kind === 't3');
  shufflePosts();
  currentIndex = 0;
}

// Shuffle posts
function shufflePosts() {
  for (let i = savedPosts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [savedPosts[i], savedPosts[j]] = [savedPosts[j], savedPosts[i]];
  }
}

// API routes
app.get('/api/load', async (req, res) => {
  try {
    await fetchSaved();
    if (savedPosts.length === 0) {
      return res.json({ error: 'No saved posts found.' });
    }
    res.json({ post: savedPosts[currentIndex] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load saved posts.' });
  }
});

app.get('/api/next', (req, res) => {
  if (savedPosts.length === 0) return res.json({ error: 'No posts loaded.' });
  currentIndex = (currentIndex + 1) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

app.get('/api/prev', (req, res) => {
  if (savedPosts.length === 0) return res.json({ error: 'No posts loaded.' });
  currentIndex = (currentIndex - 1 + savedPosts.length) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

// Start server
app.listen(PORT, () => {
  console.log(`HappyScroll server running on port ${PORT}`);
});
