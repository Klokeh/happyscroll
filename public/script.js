// public/script.js


let currentPost = null;
let posts = [];
let currentIndex = 0;

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function loadPosts() {
  console.log("🟢 loadPosts() called");
  const res = await fetch('https://happyscroll.onrender.com/api/shuffle');
  const data = await res.json();
  console.log("🟢 Data from backend:", data);

  if (data.error) {
    document.getElementById('post-title').innerText = data.error;
    return;
  }

  // Store posts in array if backend sends them, else wrap single post
  posts = Array.isArray(data.posts) ? data.posts : [data.post];
  posts = shuffle(posts); // shuffle once at load
  currentIndex = 3;
  currentPost = posts[currentIndex];
  displayPost(currentPost);
}

function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  const loadingMessage = document.getElementById('loading-message');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (postContainer) postContainer.innerHTML = '';

  // Title
  const title = document.createElement('h2');
  title.innerText = post.title;

  const subreddit = document.createElement('p');
  subreddit.innerText = `Subreddit: r/${post.subreddit}`;

  const permalink = document.createElement('p');
  permalink.innerHTML = `<a href="${post.permalink}" target="_blank">View on Reddit</a>`;

  postContainer.appendChild(title);
  postContainer.appendChild(subreddit);
  postContainer.appendChild(permalink);

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
      video.controls = true;
      video.style.maxWidth = '100%';
      postContainer.appendChild(video);
    }

  } else {
    const link = document.createElement('p');
    link.innerHTML = `Link: <a href="${post.url}" target="_blank">${post.url}</a>`;
    postContainer.appendChild(link);
  }
}

// Next / Previous
function nextPost() {
  if (currentIndex < posts.length - 1) {
    currentIndex++;
    currentPost = posts[currentIndex];
    displayPost(currentPost);
  }
}

function prevPost() {
  if (currentIndex > 0) {
    currentIndex--;
    currentPost = posts[currentIndex];
    displayPost(currentPost);
  }
}

// Shuffle button
function shufflePosts() {
  posts = shuffle(posts);
  currentIndex = 0;
  currentPost = posts[currentIndex];
  displayPost(currentPost);
}

window.onload = loadPosts;

// Hook up buttons
document.getElementById('next-btn').addEventListener('click', nextPost);
document.getElementById('prev-btn').addEventListener('click', prevPost);
document.getElementById('shuffle-btn').addEventListener('click', shufflePosts);

/*
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
*/
