// public/script.js
let currentPost = null;

// Fetch a random post
async function fetchRandomPost() {
  const res = await fetch('https://happyscroll.onrender.com/api/shuffle');
  const data = await res.json();
  if (data.error) {
    document.getElementById('post-container').innerText = data.error;
    return;
  }
  currentPost = data.post;
  displayPost(currentPost);
}

// Fetch next post from backend
async function nextPost() {
  const res = await fetch('https://happyscroll.onrender.com/api/next');
  const data = await res.json();
  if (data.error) {
    document.getElementById('post-container').innerText = data.error;
    return;
  }
  currentPost = data.post;
  displayPost(currentPost);
}

// Fetch previous post from backend
async function prevPost() {
  const res = await fetch('https://happyscroll.onrender.com/api/prev');
  const data = await res.json();
  if (data.error) {
    document.getElementById('post-container').innerText = data.error;
    return;
  }
  currentPost = data.post;
  displayPost(currentPost);
}

// Display post in page
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

  // Handle content types
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

// Hook up buttons
document.getElementById('next-btn').addEventListener('click', nextPost);
document.getElementById('prev-btn').addEventListener('click', prevPost);
document.getElementById('shuffle-btn').addEventListener('click', fetchRandomPost);

// Load a random post on page load
window.onload = fetchRandomPost;


/*
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
  currentIndex = 0;
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

  //const permalink = document.createElement('p');
  //permalink.innerHTML = `<a href="${post.permalink}" target="_blank">View on Reddit</a>`;

  postContainer.appendChild(title);
  postContainer.appendChild(subreddit);
 // postContainer.appendChild(permalink);

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


window.onload = loadPosts;

// Hook up buttons
document.getElementById('next-btn').addEventListener('click', nextPost);
document.getElementById('prev-btn').addEventListener('click', prevPost);

*/
