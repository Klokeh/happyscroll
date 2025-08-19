// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];
let currentIndex = 0;

// Middleware
app.use(cors());
app.use(express.static('public'));

// ---------- Function to get Access Token ----------
async function getAccessToken() {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN
    });

    const response = await axios.post('https://www.reddit.com/api/v1/access_token', params, {
      auth: { username: process.env.CLIENT_ID, password: '' },
      headers: { 'User-Agent': process.env.USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded' }
    });

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

    console.log(`✅ Retrieved ${response.data.data.children.length} saved posts`);

    return response.data.data.children.map(post => ({
      title: post.data.title,
      url: post.data.url,
      permalink: `https://reddit.com${post.data.permalink}`,
      subreddit: post.data.subreddit,
      is_self: post.data.is_self,
      selftext_html: post.data.selftext_html,
      is_video: post.data.is_video,
      media: post.data.media,
      post_hint: post.data.post_hint
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

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
