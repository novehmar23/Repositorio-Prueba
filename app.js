const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const { getStoredPosts, storePosts } = require("./data/posts");
const { getStoredProjects } = require("./data/projects");
const { getStoredExperiences } = require("./data/experiences");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World from the Backend");
});

// app.use((req, res, next) => {
//   // Attach CORS headers
//   // Required when using a detached backend (that runs on a different domain)
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
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
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ projects: storedProjects });
});

app.get("/experiences", async (req, res) => {
  const storedExperiences = await getStoredExperiences();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ experiences: storedExperiences });
});

// Configuración de transporte de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "novelliharispem@gmail.com",
    pass: "ppui ujld qbwa lswl",
  },
});

// Ruta para recibir el formulario y enviar un correo
app.post("/send-email", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Configuración del correo
  const mailOptions = {
    from: email,
    to: "novelliharispem@gmail.com",
    subject: `New contact form submission: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error);
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(80, "0.0.0.0", () => {
    console.log("Server listening in: 0.0.0.0:80");
});
