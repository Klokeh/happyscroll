// public/script.js

let currentPost = null;

// Load a random post from backend
async function loadPosts() {
  console.log("🟢 loadPosts() called");
  try {
    const res = await fetch('https://happyscroll.onrender.com/api/shuffle');
    const data = await res.json();
    console.log("🟢 Data from backend:", data);

    if (data.error) {
      document.getElementById('post-container').innerText = data.error;
      return;
    }

    currentPost = data.post;
    displayPost(currentPost);

  } catch (err) {
    console.error('❌ Error fetching post:', err);
    document.getElementById('post-container').innerText = 'Error fetching post';
  }
}

// Display a post in the page
function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  const loadingMessage = document.getElementById('loading-message');

  if (loadingMessage) loadi

/*
let currentPost = null;

// Load a random post from backend
async function loadPosts() {
  console.log("🟢 loadPosts() called");
  try {
    const res = await fetch('https://happyscroll.onrender.com/api/shuffle');
    const data = await res.json();
    console.log("🟢 Data from backend:", data);

    if (data.error) {
      document.getElementById('post-container').innerText = data.error;
      return;
    }

    currentPost = data.post;
    displayPost(currentPost);

  } catch (err) {
    console.error('❌ Error fetching post:', err);
    document.getElementById('post-container').innerText = 'Error fetching post';
  }
}

// Display a post in the page
function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  const loadingMessage = document.getElementById('loading-message');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (postContainer) postContainer.innerHTML = '';

  // Title
  const title = document.createElement('h2');
  title.innerText = post.title;

  // Subreddit
  const subreddit = document.createElement('p');
  subreddit.innerText = `Subreddit: r/${post.subreddit}`;

  postContainer.appendChild(title);
  postContainer.appendChild(subreddit);

  // Content types
  if (post.is_self) {
    const selfText = document.createElement('div');
    selfText.innerHTML = post.selftext_html || post.selftext || '';
    postContainer.appendChild(selfText);

  } else if (post.url.match(/\.(jpeg|jpg|gif|png)$/)) {
    const image = document.createElement('img');
    image.src = post.url;
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    postContainer.appendChild(image);

  } else if (post.is_video || (post.post_hint === 'hosted:video' && post.media)) {
    const videoUrl = post.media?.reddit_video?.fallback_url;
    if (videoUrl) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.controls = true;    // show play/pause and volume controls
      video.autoplay = false;   // do not autoplay
      video.muted = false;      // ensure sound is on
      video.style.maxWidth = '100%';
      postContainer.appendChild(video);
    }

  } else {
    const link = document.createElement('p');
    link.innerHTML = `Link: <a href="${post.url}" target="_blank">${post.url}</a>`;
    postContainer.appendChild(link);
  }
}

// Automatically load a random post on page load
window.onload = loadPosts;
*/
