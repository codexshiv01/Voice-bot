# 🎙️ Voice AI Agent (Personal Assistant)

A highly responsive, real-time Voice AI agent that people can call via a real phone number to learn about your professional background, skills, and projects. Callers can also seamlessly book appointments directly through the AI.

Built with **Node.js**, **Express**, and **Vapi.ai** (which orchestrates Deepgram STT, OpenAI LLMs, and ElevenLabs TTS).

---

## ✨ Features

- **📞 True Telephony:** Reached via a real phone number.
- **⚡ Ultra-Low Latency:** Real-time conversational AI achieving sub-400ms response times.
- **🧠 Personalized Knowledge Base:** Acts as your autonomous representative; knows your resume, skills, achievements, and professional interests inside out.
- **📅 Interactive Appointment Booking:** 
  - Callers can request meetings.
  - The AI captures details (Name, Email, Date, Time, Purpose).
  - Webhook integration triggers customized HTML email notifications via **Nodemailer** to both the host and the caller (including Google Meet links).
- **🗣️ Natural Continuity:** Configured with specific system prompts to ensure the AI behaves like a professional colleague (e.g., verifying email spelling before booking, staying in character).

---

## 🏗️ Architecture Stack

| Component | Technology / Service |
|---|---|
| **Voice & Telephony Orchestration** | [Vapi.ai](https://vapi.ai/) |
| **Speech-to-Text (STT)** | Deepgram (Nova-2) |
| **LLM / Brain** | OpenAI (GPT-4o-mini) |
| **Text-to-Speech (TTS)** | ElevenLabs |
| **Backend Webhook** | Node.js + Express.js |
| **Email Notifications** | Nodemailer (Gmail SMTP) |
| **Local Tunneling** | ngrok |

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
- **Node.js 18+** installed.
- **Vapi.ai Account:** You need a free account, a Vapi API Key, and a purchased/imported phone number.
- **Gmail Account:** For sending booking confirmations (requires 2-Step Verification and an App Password).

### 2. Clone and Install
\`\`\`bash
git clone https://github.com/your-username/voice-ai-agent.git
cd voice-ai-agent
npm install
\`\`\`

### 3. Environment Variables
Copy the template file and fill in your credentials:
\`\`\`bash
cp .env.example .env
\`\`\`
*(Refer to \`.env.example\` for exactly where to find your Vapi and Gmail keys).*

### 4. Personalize Your AI
Open \`src/profile-data.js\` and replace the template data with your actual resume information, projects, and competitive programming achievements. The \`buildSystemPrompt()\` function uses this data to dynamically generate the AI's core instructions.

### 5. Start the Booking Webhook (Local Dev)
To allow the AI to trigger the appointment booking function, you need a public URL pointing to your local server.

Start ngrok:
\`\`\`bash
ngrok http 3000
\`\`\`
Copy the \`https://...\` ngrok URL and paste it into your \`.env\` as \`PUBLIC_SERVER_URL\`.

Start the Express Server:
\`\`\`bash
npm run server
\`\`\`

### 6. Deploy the AI Assistant
In a new terminal split, run the setup script. This one-time script communicates with Vapi's API to build your assistant, inject your custom system prompt, register the booking webhook tool, and attach the assistant to your phone number.

\`\`\`bash
npm run setup
\`\`\`

### 7. Test it Out!
Call your Vapi phone number from any phone. Say hello, ask it about your experience, and try booking a meeting!

---

## 📁 Repository Structure

\`\`\`text
├── .env.example             # Environment variable templates
├── package.json             # App dependencies
├── src/
│   ├── profile-data.js      # Structured resume data & System Prompt generator
│   ├── setup-assistant.js   # Script to programmatically create the Vapi assistant
│   └── booking-server.js    # Express webhook server for the booking tool & emails
└── README.md
\`\`\`

---

## 🔧 Customization

- **Voice Model:** Open \`src/setup-assistant.js\` and change the \`voiceId\` within the \`voice\` configuration block.
- **AI Persona Rules:** Open \`src/profile-data.js\` and tweak the \`## IMPORTANT RULES\` section at the bottom to change how the AI introduces itself or handles edge cases.
- **Email Design:** The HTML templates for the booking confirmation emails are fully customizable inside \`src/booking-server.js\`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
