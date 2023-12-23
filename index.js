// Import express and body-parser modules
import express from "express";
import bodyParser from "body-parser";

// Initialize the express app
const app = express();
const port = 3000;

// Initialize an array to store blog posts and a counter for post IDs
let posts = [];
let currentId = 0;

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the home page with all blog posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

// Route to render the 'Compose' page
app.get("/start", (req, res) => {
  res.render("compose.ejs");
});

// Route to handle the submission of a new blog post
app.post("/compose", (req, res) => {
  // Create a new post object with a unique ID
  const post = {
    postId: currentId++,
    postTitle: req.body["title"],
    postContent: req.body["content"]
  };
  
  // Add the new post to the array of posts
  posts.push(post);

  // Redirect to a confirmation page after successful submission
  res.redirect("/confirmation");
});

// Route to render the confirmation page
app.get("/confirmation", (req, res) => {
  res.render("confirmation.ejs");
});

// Route to render the 'Edit' page for a specific post
app.get("/edit/:id", (req, res) => {
  // Parse the ID from the URL
  const editId = parseInt(req.params.id, 10);

  // Find the post by its ID
  const editPost = posts.find(({ postId }) => postId === editId);
  
  // If the post doesn't exist, send a 404 response
  if(!editPost) {
    res.status(404).send("Page Not Found.");
  }

  // Render the edit page with the post's data
  res.render("edit.ejs", { editPost: editPost });
});

// Route to handle the updating of an existing post
app.post("/update", (req, res) => {
  // Parse the ID from the submitted form data
  const updateId = parseInt(req.body["editId"], 10);
  // Find the index of the post in the array
  const postIndex = posts.findIndex(({ postId }) => postId === updateId);

  // If the post exists, update it
  if (postIndex !== -1) {
    posts[postIndex] = {
      ...posts[postIndex], // Retain the existing properties
      postTitle: req.body["editTitle"],
      postContent: req.body["editContent"]
    };

    // Redirect to the home page after successful update
    res.redirect("/");

  } else {
    // If the post doesn't exist, send a 404 response
    res.status(404).send("Post not found");
  } 
});

// Route to handle the deletion of a post
app.post("/delete/:id", (req, res) => {
  // Parse the ID from the URL
  const deleteId = parseInt(req.params.id, 10);
  // Find the index of the post in the array
  const deleteIndex = posts.findIndex(({ postId }) => postId === deleteId)

  // If the post exists, delete it from the array
  if (deleteIndex !== -1) {
    posts.splice(deleteIndex, 1);
  }

  // Redirect to the home page after successful deletion
  res.redirect("/");
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
