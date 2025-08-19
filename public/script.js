// public/script.js
let currentPost = null;

async function loadPosts() {
  console.log("🟢 loadPosts() called");
  try {
    const res = await fetch('http://localhost:3000/api/shuffle');
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

function displayPost(post) {
  const postContainer = document.getElementById('post-container');
  const loadingMessage = document.getElementById('loading-message');

  if (loadingMessage) loadingMessage.style.display = 'none';
  if (postContainer) postContainer.innerHTML = '';

  const title = document.createElement('h2');
  title.innerText = post.title;
  const subreddit = document.createElement('p');
  subreddit.innerText = `Subreddit: r/${post.subreddit}`;

  postContainer.appendChild(title);
  postContainer.appendChild(subreddit);

  if (post.is_self) {
    const selfText = document.createElement('div');
    selfText.innerHTML = post.selftext_html || post.selftext || '';
    postContainer.appendChild(selfText);

  } else if (post.url.match(/\.(jpeg|jpg|gif|png)$/)) {
    const image = document.createElement('img');
    image.src = post.url;
    postContainer.appendChild(image);

  } else if (post.is_video) {
    const video = document.createElement('video');
    video.src = post.url;
    video.controls = true;
    video.autoplay = false;
    video.style.maxWidth = '100%';
    postContainer.appendChild(video);

  } else {
    const link = document.createElement('p');
    link.innerHTML = `<a href="${post.url}" target="_blank">${post.url}</a>`;
    postContainer.appendChild(link);
  }
}

window.onload = loadPosts;


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

  if (loadingMessage) loadi
*/
