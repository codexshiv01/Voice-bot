/**
 * ============================================================
 *  BOOKING WEBHOOK SERVER (with Email Notifications)
 * ============================================================
 *
 *  Handles the "book_appointment" tool calls from Vapi.
 *  Sends email confirmations to BOTH you and the recruiter/caller.
 *
 *  Usage:  npm run server
 * ============================================================
 */

require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BOOKINGS_FILE = path.join(__dirname, "..", "bookings.json");

// ── Email Configuration ──────────────────────────────────────
const YOUR_NAME = process.env.YOUR_NAME || "Shivansh Agrawal";
const YOUR_EMAIL = process.env.YOUR_EMAIL || "shivanshagrawal831@gmail.com";

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Verify connection
  transporter.verify((err) => {
    if (err) {
      console.error("⚠️  Email setup failed:", err.message);
      console.error("   Bookings will be saved locally but emails won't be sent.\n");
      transporter = null;
    } else {
      console.log("✅ Email configured successfully!");
      console.log(`   Notifications will be sent from: ${process.env.EMAIL_USER}\n`);
    }
  });
} else {
  console.log("⚠️  Email not configured (EMAIL_USER / EMAIL_APP_PASSWORD missing in .env)");
  console.log("   Bookings will be saved locally only.\n");
}

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());

// ── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Voice AI Agent — Booking Server",
    emailConfigured: !!transporter,
    timestamp: new Date().toISOString(),
  });
});

// ── Vapi Tool Webhook: Book Appointment ──────────────────────
app.post("/api/book-appointment", async (req, res) => {
  console.log("\n📥 Incoming booking request from Vapi");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const { message } = req.body;

    if (!message || message.type !== "tool-calls") {
      const result = await handleBooking(req.body);
      return res.json(result);
    }

    // Process tool calls from Vapi
    const results = [];
    for (const toolCall of message.toolCallList || []) {
      if (toolCall.name === "book_appointment" || toolCall.function?.name === "book_appointment") {
        const args = toolCall.arguments || toolCall.function?.arguments || {};
        const bookingResult = await handleBooking(args);
        results.push({
          toolCallId: toolCall.id,
          result: bookingResult.message,
        });
      }
    }

    // Also check toolWithToolCallList format
    if (results.length === 0 && message.toolWithToolCallList) {
      for (const item of message.toolWithToolCallList) {
        const toolCall = item.toolCall;
        if (toolCall) {
          const args = toolCall.function?.parameters || toolCall.arguments || {};
          const bookingResult = await handleBooking(args);
          results.push({
            toolCallId: toolCall.id,
            result: bookingResult.message,
          });
        }
      }
    }

    console.log("✅ Sending response to Vapi:", JSON.stringify({ results }, null, 2));
    res.json({ results });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.json({
      results: [
        {
          toolCallId: req.body?.message?.toolCallList?.[0]?.id || "unknown",
          result:
            "I'm sorry, there was an issue booking the appointment. Please try emailing shivanshagrawal831@gmail.com directly.",
        },
      ],
    });
  }
});

// ── Handle Booking Logic ─────────────────────────────────────
async function handleBooking(args) {
  const booking = {
    id: `booking_${Date.now()}`,
    callerName: args.caller_name || "Unknown",
    callerEmail: args.caller_email || "Not provided",
    preferredDate: args.preferred_date || "Not specified",
    preferredTime: args.preferred_time || "Not specified",
    purpose: args.purpose || "General meeting",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  console.log("\n📅 New Booking Request:");
  console.log(`   Name:    ${booking.callerName}`);
  console.log(`   Email:   ${booking.callerEmail}`);
  console.log(`   Date:    ${booking.preferredDate}`);
  console.log(`   Time:    ${booking.preferredTime}`);
  console.log(`   Purpose: ${booking.purpose}`);

  // Save to local JSON file
  saveBooking(booking);

  // Send emails
  await sendEmails(booking);

  return {
    success: true,
    message: `Great! I've booked the appointment successfully. ${booking.callerName}, your meeting with ${YOUR_NAME} has been scheduled for ${booking.preferredDate} at ${booking.preferredTime || "a time to be confirmed"}. A confirmation email has been sent to ${booking.callerEmail}. Is there anything else you'd like to know?`,
  };
}

// ── Send Email Notifications ─────────────────────────────────
async function sendEmails(booking) {
  if (!transporter) {
    console.log("   📧 Email not configured — skipping notifications\n");
    return;
  }

  const MEETING_LINK = "https://meet.google.com/pip-fhfv-ucg";

  try {
    // ── Email 1: Notify YOU (Shivansh) about the new booking ──
    await transporter.sendMail({
      from: `"Voice AI Agent" <${process.env.EMAIL_USER}>`,
      to: YOUR_EMAIL,
      subject: `📅 New Booking Request from ${booking.callerName}`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1a73e8; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 400;">New Appointment Booking</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #3c4043; margin-top: 0;">Someone booked a meeting through your AI agent.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
              <tr><td style="padding: 8px 0; color: #5f6368; width: 100px;">Name:</td><td style="padding: 8px 0; color: #202124; font-weight: 500;">${booking.callerName}</td></tr>
              <tr><td style="padding: 8px 0; color: #5f6368;">Email:</td><td style="padding: 8px 0; color: #202124;"><a href="mailto:${booking.callerEmail}" style="color: #1a73e8; text-decoration: none;">${booking.callerEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #5f6368;">When:</td><td style="padding: 8px 0; color: #202124; font-weight: 500;">${booking.preferredDate} at ${booking.preferredTime}</td></tr>
              <tr><td style="padding: 8px 0; color: #5f6368;">Purpose:</td><td style="padding: 8px 0; color: #202124;">${booking.purpose}</td></tr>
            </table>

            <div style="border-top: 1px solid #e0e0e0; padding-top: 24px; margin-top: 24px;">
              <h3 style="margin: 0 0 16px 0; color: #202124; font-size: 16px; font-weight: 500;">Joining info</h3>
              <p style="margin: 0 0 16px 0; color: #5f6368;">Google Meet joining info has been sent to the caller.</p>
              <a href="${MEETING_LINK}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 4px; font-weight: 500; font-size: 14px;">Join Google Meet</a>
              <p style="margin: 16px 0 0 0; font-size: 14px; color: #5f6368;">Video call link: <a href="${MEETING_LINK}" style="color: #1a73e8; text-decoration: none;">${MEETING_LINK}</a></p>
            </div>
            
            <div style="margin-top: 32px; padding: 16px; background: #f1f3f4; border-radius: 8px;">
              <p style="margin: 0; color: #3c4043; font-size: 14px;">💡 <strong>To confirm or reschedule:</strong> Reply directly to ${booking.callerEmail}</p>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`   📧 Notification email sent to YOU (${YOUR_EMAIL})`);

    // ── Email 2: Confirmation to the RECRUITER/CALLER ──────────
    if (booking.callerEmail && booking.callerEmail !== "Not provided") {
      await transporter.sendMail({
        from: `"${YOUR_NAME}'s AI Assistant" <${process.env.EMAIL_USER}>`,
        to: booking.callerEmail,
        subject: `Invitation: Meeting with ${YOUR_NAME} @ ${booking.preferredDate} ${booking.preferredTime}`,
        html: `
          <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #e0e0e0;">
              <h1 style="color: #202124; margin: 0 0 16px 0; font-size: 22px; font-weight: 400;">Meeting Confirmation</h1>
              <p style="font-size: 16px; color: #3c4043; margin: 0;">Hi ${booking.callerName},</p>
              <p style="font-size: 16px; color: #3c4043; margin: 12px 0 0 0;">This email confirms your meeting request with <strong>${YOUR_NAME}</strong>.</p>
            </div>
            
            <div style="padding: 24px 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5f6368; width: 30px; vertical-align: top;">🕒</td>
                  <td style="padding: 8px 0; color: #202124; font-weight: 500;">
                    ${booking.preferredDate}<br/>
                    <span style="color: #5f6368; font-weight: 400; font-size: 14px;">${booking.preferredTime}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 8px 0; color: #5f6368; vertical-align: top;">📝</td>
                  <td style="padding: 16px 0 8px 0; color: #202124;">
                    ${booking.purpose}
                  </td>
                </tr>
              </table>
              
              <div style="margin-top: 32px; border: 1px solid #dadce0; border-radius: 8px; padding: 20px;">
                <h3 style="margin: 0 0 16px 0; color: #202124; font-size: 16px; font-weight: 500;">Joining info</h3>
                <div style="margin-bottom: 16px;">
                  <a href="${MEETING_LINK}" style="display: inline-block; background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 4px; font-weight: 500; font-size: 14px;">Join Google Meet</a>
                </div>
                <p style="margin: 0; font-size: 14px; color: #5f6368;">Meeting URL: <a href="${MEETING_LINK}" style="color: #1a73e8; text-decoration: none; word-break: break-all;">${MEETING_LINK}</a></p>
              </div>
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0; text-align: center;">
                <p style="margin: 0; color: #5f6368; font-size: 14px;">
                  Need to reschedule? Reply directly to this email or contact <a href="mailto:${YOUR_EMAIL}" style="color: #1a73e8; text-decoration: none;">${YOUR_EMAIL}</a>
                </p>
                <p style="margin: 16px 0 0 0; color: #9aa0a6; font-size: 12px;">
                  Automated meeting coordination by ${YOUR_NAME}'s AI Voice Agent
                </p>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`   📧 Confirmation email sent to CALLER (${booking.callerEmail})`);
    }

    console.log("   ✅ All emails sent successfully!\n");
  } catch (err) {
    console.error("   ❌ Email sending failed:", err.message);
    console.log("   Booking is still saved locally.\n");
  }
}

// ── Save Booking to JSON File ────────────────────────────────
function saveBooking(booking) {
  let bookings = [];
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      bookings = JSON.parse(data);
    }
  } catch (e) {
    bookings = [];
  }

  bookings.push(booking);
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  console.log(`   💾 Saved to bookings.json (${bookings.length} total bookings)`);
}

// ── View All Bookings ────────────────────────────────────────
app.get("/api/bookings", (req, res) => {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } else {
      res.json([]);
    }
  } catch (e) {
    res.json([]);
  }
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════");
  console.log("  📞 Voice AI Agent — Booking Server");
  console.log("═══════════════════════════════════════════════");
  console.log(`\n  Server running at: http://localhost:${PORT}`);
  console.log(`  Booking endpoint:  POST /api/book-appointment`);
  console.log(`  View bookings:     GET  /api/bookings`);
  console.log(`\n  For local dev, run: ngrok http ${PORT}\n`);
});
