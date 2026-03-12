/**
 * ============================================================
 *  VAPI ASSISTANT SETUP SCRIPT
 * ============================================================
 *
 *  Run this ONCE to create your AI assistant on Vapi and
 *  attach it to your phone number.
 *
 *  Usage:  npm run setup
 *
 *  What it does:
 *   1. Creates an AI assistant with your resume as the system prompt
 *   2. Adds a "book_appointment" tool so callers can schedule meetings
 *   3. Attaches the assistant to your Vapi phone number
 *
 *  After running this, anyone who calls your number will talk
 *  to your AI agent!
 * ============================================================
 */

require("dotenv").config();
const fetch = require("node-fetch");
const { buildSystemPrompt } = require("./profile-data");

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const PUBLIC_SERVER_URL = process.env.PUBLIC_SERVER_URL || "";
const VAPI_BASE_URL = "https://api.vapi.ai";

// ── Helpers ──────────────────────────────────────────────────
async function vapiRequest(method, endpoint, body) {
  const url = `${VAPI_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VAPI_API_KEY}`,
    },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    console.error(`\n❌ Vapi API error (${res.status}):`, JSON.stringify(data, null, 2));
    throw new Error(`Vapi API request failed: ${res.status}`);
  }
  return data;
}

// ── Step 1: Create the Assistant ─────────────────────────────
async function createAssistant() {
  console.log("\n🤖 Creating AI assistant on Vapi...\n");

  const systemPrompt = buildSystemPrompt();

  const assistantConfig = {
    name: "Personal Voice Agent",
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.7,
      systemPrompt: systemPrompt,
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",  // "Rachel" - professional female voice
      // You can change this! Other options:
      //   "ErXwobaYiN019PkySvjV"  - "Antoni" - male
      //   "EXAVITQu4vr4xnSDxMaL"  - "Bella" - female  
      //   "onwK4e9ZLuTAKqWW03F9"  - "Daniel" - male (British)
      //   Or browse: https://api.elevenlabs.io/v1/voices
    },
    firstMessage: "Hi, I am Shivansh's assistant! I can tell you about his skills, experience at ScaleMock, projects, and even help you schedule a meeting. How can I help you today?",
    endCallMessage: "Thanks for calling! Have a great day!",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    // Silence timeout - end call after 30s of silence
    silenceTimeoutSeconds: 30,
    // Max call duration - 10 minutes
    maxDurationSeconds: 600,
  };

  // Add booking tool if server URL is configured
  if (PUBLIC_SERVER_URL) {
    assistantConfig.model.tools = [
      {
        type: "function",
        function: {
          name: "book_appointment",
          description:
            "Book an appointment/meeting with the person. Use this when the caller wants to schedule a call, meeting, or interview.",
          parameters: {
            type: "object",
            properties: {
              caller_name: {
                type: "string",
                description: "The name of the person calling who wants to book",
              },
              caller_email: {
                type: "string",
                description: "Email address of the caller for confirmation",
              },
              preferred_date: {
                type: "string",
                description: "Their preferred date (e.g., '2025-03-15' or 'next Monday')",
              },
              preferred_time: {
                type: "string",
                description: "Their preferred time (e.g., '2:00 PM' or 'afternoon')",
              },
              purpose: {
                type: "string",
                description: "Brief description of what the meeting is about",
              },
            },
            required: ["caller_name", "caller_email", "preferred_date"],
          },
        },
        server: {
          url: `${PUBLIC_SERVER_URL}/api/book-appointment`,
        },
      },
    ];
    console.log("📅 Appointment booking tool configured");
    console.log(`   Webhook URL: ${PUBLIC_SERVER_URL}/api/book-appointment\n`);
  } else {
    console.log("⚠️  No PUBLIC_SERVER_URL set — appointment booking disabled");
    console.log("   Set it in .env to enable booking via the ai agent\n");
  }

  const assistant = await vapiRequest("POST", "/assistant", assistantConfig);

  console.log(`✅ Assistant created!`);
  console.log(`   ID:   ${assistant.id}`);
  console.log(`   Name: ${assistant.name}\n`);

  return assistant;
}

// ── Step 2: Attach Assistant to Phone Number ─────────────────
async function attachToPhoneNumber(assistantId) {
  console.log(`📞 Attaching assistant to phone number (${VAPI_PHONE_NUMBER_ID})...\n`);

  const result = await vapiRequest("PATCH", `/phone-number/${VAPI_PHONE_NUMBER_ID}`, {
    assistantId: assistantId,
  });

  console.log(`✅ Phone number configured!`);
  console.log(`   Number: ${result.number || result.name || VAPI_PHONE_NUMBER_ID}`);
  console.log(`   Assistant: ${assistantId}\n`);

  return result;
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log("  🎙️  Voice AI Agent Setup (Vapi.ai)");
  console.log("═══════════════════════════════════════════════");

  // Validate env
  if (!VAPI_API_KEY) {
    console.error("\n❌ VAPI_API_KEY is missing! Add it to your .env file.");
    console.error("   Get it from: https://dashboard.vapi.ai → Settings → API Keys\n");
    process.exit(1);
  }
  if (!VAPI_PHONE_NUMBER_ID) {
    console.error("\n❌ VAPI_PHONE_NUMBER_ID is missing! Add it to your .env file.");
    console.error("   Get it from: https://dashboard.vapi.ai → Phone Numbers\n");
    process.exit(1);
  }

  try {
    // Create assistant
    const assistant = await createAssistant();

    // Attach to phone number
    await attachToPhoneNumber(assistant.id);

    console.log("═══════════════════════════════════════════════");
    console.log("  🎉  SETUP COMPLETE!");
    console.log("═══════════════════════════════════════════════");
    console.log(`\n  Your AI agent is now live!`);
    console.log(`  Call your Vapi phone number to talk to it.\n`);
    console.log(`  Assistant ID: ${assistant.id}`);
    console.log(`  Save this ID in case you need to update the assistant later.\n`);

    if (PUBLIC_SERVER_URL) {
      console.log(`  📅 Booking webhook: ${PUBLIC_SERVER_URL}/api/book-appointment`);
      console.log(`  Make sure your booking server is running: npm run server\n`);
    }
  } catch (err) {
    console.error("\n💥 Setup failed:", err.message);
    process.exit(1);
  }
}

main();
