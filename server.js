// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];
let currentIndex = 0;

// ---------- Function to get Access Token ----------
async function getAccessToken() {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN
    });

    const response = await axios.post('https://www.reddit.com/api/v1/access_token', params, {
      auth: { username: process.env.CLIENT_ID, password: '' }, // installed app has no secret
      headers: { 'User-Agent': process.env.USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Logs for debugging
    console.log('🔑 Raw token response:', JSON.stringify(response.data, null, 2));
    console.log('✅ Access token retrieved:', response.data.access_token);
    console.log('⚡ Access token (debug scopes):', response.data.scope);

    return response.data.access_token;
  } catch (err) {
    console.error('❌ Error retrieving access token:', err.response?.data || err.message);
    return null;
  }
}

// ---------- Function to fetch saved posts ----------
async function fetchSavedPosts() {
  console.log("🔹 fetchSavedPosts() called");

  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await axios.get('https://oauth.reddit.com/user/No_Studio1727/saved?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.USER_AGENT
      }
    });

    console.log('📦 Raw Reddit response:', JSON.stringify(response.data, null, 2));
    console.log(`✅ Retrieved ${response.data.data.children.length} saved posts`);

    return response.data.data.children.map(post => ({
      title: post.data.title,
      url: post.data.url,
      permalink: `https://reddit.com${post.data.permalink}`,
      subreddit: post.data.subreddit
    }));
  } catch (err) {
    console.error('❌ Error fetching saved posts:', err.response?.data || err.message);
    return [];
  }
}

// ---------- API endpoint for frontend ----------
app.get('/api/shuffle', async (req, res) => {
  savedPosts = await fetchSavedPosts();
  if (!savedPosts || savedPosts.length === 0) {
    return res.json({ error: 'No saved posts found' });
  }

  currentIndex = 0;
  res.json({ post: savedPosts[currentIndex] });
});

// Next post
app.get('/api/next', (req, res) => {
  if (!savedPosts || savedPosts.length === 0) return res.json({ error: 'No posts loaded' });

  currentIndex = (currentIndex + 1) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

// Previous post
app.get('/api/prev', (req, res) => {
  if (!savedPosts || savedPosts.length === 0) return res.json({ error: 'No posts loaded' });

  currentIndex = (currentIndex - 1 + savedPosts.length) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

// ---------- Serve frontend ----------
app.use(express.static('public'));

// ---------- Force token fetch on startup ----------
getAccessToken();

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
