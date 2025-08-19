const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];
let currentIndex = 0;

// Middleware to serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Function to fetch a new access token using refresh token
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${process.env.CLIENT_ID}:`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', process.env.REFRESH_TOKEN);

    const response = await axios.post('https://www.reddit.com/api/v1/access_token', params, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': process.env.USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
console.log("✅ Access token retrieved:", response.data);

    return response.data.access_token;
  } catch (err) {
    console.error('❌ Error fetching access token:', err.response?.data || err.message);
    return null;
  }
}

// Fetch saved posts from Reddit
async function fetchSavedPosts() {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await axios.get('https://oauth.reddit.com/user/me/saved?limit=100', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': process.env.USER_AGENT
      }
    });
    console.log("📦 Raw saved response:", JSON.stringify(response.data, null, 2));
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

// API: Shuffle deck
app.get('/api/shuffle', async (req, res) => {
  savedPosts = await fetchSavedPosts();
  if (savedPosts.length === 0) return res.json({ error: 'No saved posts found' });

  currentIndex = 0;
  res.json({ post: savedPosts[currentIndex] });
});

// API: Next post
app.get('/api/next', (req, res) => {
  if (savedPosts.length === 0) return res.json({ error: 'No saved posts loaded' });

  currentIndex = (currentIndex + 1) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

// API: Previous post
app.get('/api/prev', (req, res) => {
  if (savedPosts.length === 0) return res.json({ error: 'No saved posts loaded' });

  currentIndex = (currentIndex - 1 + savedPosts.length) % savedPosts.length;
  res.json({ post: savedPosts[currentIndex] });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Happyscroll running on port ${PORT}`);
});
