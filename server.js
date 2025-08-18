const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

let savedPosts = [];
let currentIndex = 0;

// Helper: get a new access token using refresh token
async function getAccessToken() {
  try {
    const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.REFRESH_TOKEN
      }),
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          'User-Agent': process.env.USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error('Error getting access token:', err.response?.data || err.message);
    throw err;
  }
}

// Fetch saved posts from Reddit
async function fetchSavedPosts() {
  const token = await getAccessToken();
  const response = await axios.get('https://oauth.reddit.com/user/me/saved?limit=100', {
    headers: {
      Authorization: `bearer ${token}`,
      'User-Agent': process.env.USER_AGENT
    }
  });
  
console.log('Raw Reddit response:', JSON.stringify(response.data, null, 2));
  
  // Only include posts (t3), ignore comments
  savedPosts = response.data.data.children;
    //filter(item => item.kind === 't3');
  shufflePosts();
  currentIndex = 0;
}

// Shuffle saved posts
function shufflePosts() {
  for (let i = savedPosts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [savedPosts[i], savedPosts[j]] = [savedPosts[j], savedPosts[i]];
  }
}

// API endpoints
app.get('/api/load', async (req, res) => {
  try {
    await fetchSavedPosts();
    if (!savedPosts.length) return res.json({ error: 'No saved posts found.' });
    res.json({ post: savedPosts[currentIndex] });
  } catch {
    res.status(500).json({ error: 'Failed to load saved posts.' });
  }
});

app.get('/api/next', (req, res) => {
  if (!savedPosts.length) return res.json({ error: 'No posts loaded.' });
  currentIndex = (currentIndex + 1) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

app.get('/api/prev', (req, res) => {
  if (!savedPosts.length) return res.json({ error: 'No posts loaded.' });
  currentIndex = (currentIndex - 1 + savedPosts.length) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

app.listen(PORT, () => {
  console.log(`HappyScroll running on port ${PORT}`);
});
