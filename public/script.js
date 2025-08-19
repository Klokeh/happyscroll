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
