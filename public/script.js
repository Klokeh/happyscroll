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
