const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = 3000;

// Initialize Resend with your API key
const resend = new Resend("re_S5UE4ZSn_NLwmQQ54LHLoxqbM5BnzprWa");

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

// Helper function to send email to multiple recipients
async function sendEmailToMultipleRecipients(subject, text, recipients) {
  const results = [];

  for (const recipient of recipients) {
    try {
      console.log(`Sending email to ${recipient}...`);

      const { data, error } = await resend.emails.send({
        from: "Plant Form <onboard@resend.dev>",
        to: [recipient],
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
        console.error(`❌ Error sending to ${recipient}:`, error);
        results.push({ recipient, success: false, error });
      } else {
        console.log(`✅ Email sent successfully to ${recipient}!`);
        console.log("Email ID:", data.id);
        results.push({ recipient, success: true, data });
      }

      // Small delay between sends to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Failed to send to ${recipient}:`, error);
      results.push({ recipient, success: false, error: error.message });
    }
  }

  return results;
}

// Route for handling plant/reco ph submission
app.post("/submit-plant", async (req, res) => {
  try {
    const { ph } = req.body;
    const subject = "Plant/Reco pH Submission";
    const message = `New plant pH submission received:

PH Value: ${ph}

Submitted at: ${new Date().toLocaleString()}

NOTE: This notification was sent to multiple recipients.`;

    console.log("Received pH submission:", ph);

    // Define all recipients (previously in 'to' and 'bcc')
    const allRecipients = ["mikun5y@gmail.com", "yekeen244@gmail.com"];

    // Send email to all recipients
    const results = await sendEmailToMultipleRecipients(
      subject,
      message,
      allRecipients
    );

    const successCount = results.filter((r) => r.success).length;
    const totalCount = results.length;

    console.log(
      `✅ pH submission processed: ${successCount}/${totalCount} emails sent successfully`
    );

    res.redirect("https://galant.dev");
  } catch (error) {
    console.error("❌ Error processing pH submission:", error);
    res.redirect("https://galant.dev");
  }
});

// Test route with multiple recipients
app.get("/test-email", async (req, res) => {
  try {
    const recipients = ["mikun5y@gmail.com", "yekeen244@gmail.com"];
    const results = await sendEmailToMultipleRecipients(
      "Test Email",
      "This is a test email from your Render app!",
      recipients
    );

    const successCount = results.filter((r) => r.success).length;

    res.json({
      success: true,
      message: `Test emails sent: ${successCount}/${results.length} successful`,
      details: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(
    "✅ Resend email service initialized (using multiple sends instead of BCC)"
  );
});
