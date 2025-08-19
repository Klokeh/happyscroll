// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];

app.use(cors());
app.use(express.static('public'));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// ---------- Get Reddit Access Token ----------
async function getAccessToken() {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN
    });

    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      params,
      {
        auth: { username: process.env.CLIENT_ID, password: '' },
        headers: { 
          'User-Agent': process.env.USER_AGENT, 
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error('❌ Error retrieving access token:', err.response?.data || err.message);
    return null;
  }
}

// ---------- Fetch saved posts ----------
async function fetchSavedPosts() {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await axios.get(
      'https://oauth.reddit.com/user/No_Studio1727/saved?limit=100',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': process.env.USER_AGENT
        }
      }
    );

    return response.data.data.children.map(post => ({
      id: post.data.id,
      title: post.data.title,
      url: post.data.url,
      subreddit: post.data.subreddit,
      is_self: post.data.is_self,
      selftext_html: post.data.selftext_html,
      selftext: post.data.selftext,
      is_video: post.data.is_video,
      media: post.data.media,
      post_hint: post.data.post_hint,
      permalink: `https://reddit.com${post.data.permalink}`
    }));
  } catch (err) {
    console.error('❌ Error fetching saved posts:', err.response?.data || err.message);
    return [];
  }
}

// ---------- Merge Reddit video + audio ----------
async function mergeVideoAudio(post) {
  if (!post.is_video || !post.media?.reddit_video) return null;

  const videoUrl = post.media.reddit_video.fallback_url;
  const audioUrl = videoUrl.replace(/DASH_[0-9]+.mp4/, 'DASH_audio.mp4'); // typical Reddit audio URL

  const outputDir = path.join(__dirname, 'videos');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputFile = path.join(outputDir, `${post.id}.mp4`);

  if (fs.existsSync(outputFile)) return `/videos/${post.id}.mp4`;

  // Use ffmpeg to merge
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac "${outputFile}"`;
    exec(cmd, (err) => {
      if (err) {
        console.error('❌ ffmpeg merge error:', err);
        resolve(null); // fallback to video-only
      } else {
        resolve(`/videos/${post.id}.mp4`);
      }
    });
  });
}

// ---------- API endpoint for random post ----------
app.get('/api/shuffle', async (req, res) => {
  if (!savedPosts || savedPosts.length === 0) {
    savedPosts = await fetchSavedPosts();
  }

  if (!savedPosts || savedPosts.length === 0) {
    return res.json({ error: 'No saved posts found' });
  }

  const randomIndex = Math.floor(Math.random() * savedPosts.length);
  const post = savedPosts[randomIndex];

  if (post.is_video) {
    const mergedUrl = await mergeVideoAudio(post);
    if (mergedUrl) post.url = mergedUrl; // serve merged video
  }

  res.json({ post });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/*
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let savedPosts = [];

// Middleware
app.use(cors());
app.use(express.static('public'));

// ---------- Get Reddit Access Token ----------
async function getAccessToken() {
  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN
    });

    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      params,
      {
        auth: { username: process.env.CLIENT_ID, password: '' },
        headers: { 
          'User-Agent': process.env.USER_AGENT, 
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      }
    );

    return response.data.access_token;
  } catch (err) {
    console.error('❌ Error retrieving access token:', err.response?.data || err.message);
    return null;
  }
}

// ---------- Fetch saved posts ----------
async function fetchSavedPosts() {
  const accessToken = await getAccessToken();
  if (!accessToken) return [];

  try {
    const response = await axios.get(
      'https://oauth.reddit.com/user/No_Studio1727/saved?limit=100',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': process.env.USER_AGENT
        }
      }
    );

    return response.data.data.children.map(post => ({
      title: post.data.title,
      url: post.data.url,
      subreddit: post.data.subreddit,
      is_self: post.data.is_self,
      selftext_html: post.data.selftext_html,
      selftext: post.data.selftext,
      is_video: post.data.is_video,
      media: post.data.media,
      post_hint: post.data.post_hint,
      permalink: `https://reddit.com${post.data.permalink}`
    }));
  } catch (err) {
    console.error('❌ Error fetching saved posts:', err.response?.data || err.message);
    return [];
  }
}

// ---------- API endpoint for random post ----------
app.get('/api/shuffle', async (req, res) => {
  if (!savedPosts || savedPosts.length === 0) {
    savedPosts = await fetchSavedPosts();
  }

  if (!savedPosts || savedPosts.length === 0) {
    return res.json({ error: 'No saved posts found' });
  }

  const randomIndex = Math.floor(Math.random() * savedPosts.length);
  res.json({ post: savedPosts[randomIndex] });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/
