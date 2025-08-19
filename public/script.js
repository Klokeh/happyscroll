// public/script.js

let currentPost = null;

async function loadPosts() {
  console.log("🟢 loadPosts() called");
  const res = await fetch('https://happyscroll.onrender.com/api/shuffle');
  const data = await res.json();
  console.log("🟢 Data from backend:", data);

  if (data.error) {
    document.getElementById('post-title').innerText = data.error;
    return;
  }

  currentPost = data.post;
  displayPost(currentPost);
}

function displayPost(post) {
  document.getElementById('post-title').innerText = post.title;
  document.getElementById('post-url').href = post.url;
  document.getElementById('post-url').innerText = post.url;
}

// Next / Previous buttons
async function nextPost() {
  const res = await fetch('https://happyscroll.onrender.com/api/next');
  const data = await res.json();
  currentPost = data.post;
  displayPost(currentPost);
}

async function prevPost() {
  const res = await fetch('https://happyscroll.onrender.com/api/prev');
  const data = await res.json();
  currentPost = data.post;
  displayPost(currentPost);
}

window.onload = loadPosts;

// public/script.js

// ... (your existing code for loadPosts, nextPost, prevPost)

function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  const loadingMessage = document.getElementById('loading-message');

  // Hide the loading message and clear previous content
  if (loadingMessage) loadingMessage.style.display = 'none';
  if (postContainer) postContainer.innerHTML = ''; // Clear previous content

  // Display basic post info
  const title = document.createElement('h2');
  title.innerText = post.title;

  const subreddit = document.createElement('p');
  subreddit.innerText = `Subreddit: r/${post.subreddit}`;

  const permalink = document.createElement('p');
  permalink.innerHTML = `<a href="${post.permalink}" target="_blank">View on Reddit</a>`;

  if (postContainer) {
    postContainer.appendChild(title);
    postContainer.appendChild(subreddit);
    postContainer.appendChild(permalink);
  }

  // Handle different content types
  if (post.is_self) {
    // Self-text post
    const selfText = document.createElement('div');
    selfText.innerHTML = post.selftext_html; // Be careful with this, as it contains raw HTML.
    if (postContainer) postContainer.appendChild(selfText);

  } else if (post.url.match(/\.(jpeg|jpg|gif|png)$/)) {
    // Image post
    const image = document.createElement('img');
    image.src = post.url;
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    if (postContainer) postContainer.appendChild(image);

  } else if (post.is_video || (post.post_hint === 'hosted:video' && post.media)) {
    // Hosted Reddit video
    const videoUrl = post.media.reddit_video.fallback_url;
    const video = document.createElement('video');
    video.src = videoUrl;
    video.controls = true;
    video.style.maxWidth = '100%';
    if (postContainer) postContainer.appendChild(video);

  } else {
    // A regular link or other unsupported content
    const link = document.createElement('p');
    link.innerHTML = `Link: <a href="${post.url}" target="_blank">${post.url}</a>`;
    if (postContainer) postContainer.appendChild(link);
  }
}
