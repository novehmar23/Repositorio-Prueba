const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const { getStoredPosts, storePosts } = require("./data/posts");
const { getStoredProjects } = require("./data/projects");
const { getStoredExperiences } = require("./data/experiences");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World from the Backend!");
});

app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts();
  res.json({ posts: storedPosts });
});

app.get("/posts/:id", async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post("/posts", async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: "Stored new post.", post: newPost });
});

app.get("/projects", async (req, res) => {
  const storedProjects = await getStoredProjects();
  res.json({ projects: storedProjects });
});

app.get("/experiences", async (req, res) => {
  const storedExperiences = await getStoredExperiences();
  res.json({ experiences: storedExperiences });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "novelliharispem@gmail.com",
    pass: "ppui ujld qbwa lswl",
  },
});

app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "novelliharispem@gmail.com",
    subject: `New contact form submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: \n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error);
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(8080, '0.0.0.0', () => {
  console.log("Backend listening on port: 8080");
});
