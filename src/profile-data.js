/**
 * ============================================================
 *  SHIVANSH AGRAWAL — PROFESSIONAL PROFILE DATA
 * ============================================================
 */

const profile = {
  // ── Personal Info ──────────────────────────────────────────
  name: "Shivansh Agrawal",
  title: "Founding Software Engineer & Full-Stack Developer",
  location: "India",
  email: "shivanshagrawal831@gmail.com",
  phone: "+91-8318684654",
  linkedin: "https://linkedin.com/in/shivansh-agrawal",
  github: "https://github.com/shivansh-agrawal",
  codeforces: "https://codeforces.com/profile/shivansh",
  leetcode: "https://leetcode.com/shivansh",
  codechef: "https://codechef.com/users/shivansh",

  // ── Professional Summary ───────────────────────────────────
  summary: `
    I'm a Founding Software Engineer at ScaleMock and a passionate full-stack
    developer. I specialize in building high-performance, real-time systems
    using Node.js, React, and cloud infrastructure. I've architected a real-time
    voice AI pipeline with sub-400ms latency, built sandboxed code execution
    engines, and designed scalable collaborative system design tools. I'm also
    a competitive programmer with achievements in Codeforces, CodeChef, ICPC,
    Google CodeJam, Google HashCode, and Meta Hacker Cup.
  `,

  // ── Skills ─────────────────────────────────────────────────
  skills: {
    languages: ["C++", "JavaScript", "Python", "SQL"],
    frontend: ["React.js", "React Native", "Tailwind CSS", "Vite"],
    backend: ["Node.js", "MongoDB", "PostgreSQL", "REST API", "MVC Architecture"],
    cloud_and_devops: ["AWS", "Docker", "Kafka", "Redis", "Git"],
    concepts: [
      "Data Structures & Algorithms",
      "System Design",
      "Real-time Systems (WebSockets)",
      "Problem Solving",
      "Leadership",
    ],
  },

  // ── Work Experience ────────────────────────────────────────
  experience: [
    {
      role: "Founding Software Engineer",
      company: "ScaleMock",
      period: "April 2024 – Present",
      location: "Remote",
      highlights: [
        "Architected a real-time bi-directional voice pipeline using WebSockets, Deepgram API, and Groq (LLaMA 3), optimizing audio chunk streaming with 250ms buffer to achieve sub-400ms conversational latency for AI interviewers — rivaling human response times",
        "Designed a sandboxed Remote Code Execution (RCE) service using Docker API and Node.js Streams, enforcing strict cgroup resource limits (512MB RAM, 0.5 CPU) to securely execute untrusted C++/Java/Python code with 100% isolation",
        "Optimized database throughput by 40% through Partial Indexing on active subscriptions and PL/pgSQL triggers for real-time activity tracking, ensuring under 50ms query response times under concurrent load",
        "Built a high-performance VS Code-like IDE using React Resizable Panels and Monaco Editor, leveraging virtualized lists for file explorers",
        "Architected a collaborative System Design tool using React Flow, creating custom draggable nodes (Load Balancers, Shards) that serialize architectural diagrams into JSON for backend scalability analysis",
      ],
    },
  ],

  // ── Education ──────────────────────────────────────────────
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Sharda University, Greater Noida, India",
      year: "May 2020 – July 2024",
    },
  ],

  // ── Projects ───────────────────────────────────────────────
  projects: [
    {
      name: "ScaleMock Platform",
      description:
        "A comprehensive mock interview and system design practice platform featuring real-time AI voice interviewers with sub-400ms latency, sandboxed code execution, a VS Code-like IDE, and collaborative system design tools with React Flow.",
      techStack: ["React", "Node.js", "PostgreSQL", "WebSockets", "Deepgram", "Docker", "AWS"],
      link: "https://scalemock.com",
    },
    {
      name: "LeetCode Reminder (Chrome Extension)",
      description:
        "A Chrome extension that helps users retain coding problems using spaced repetition by sending automated email reminders at 3, 6, 12, and 24 days. Supports 24/7 uptime with rate limiting, health checks, and a modern UI matching LeetCode's design. Uses Nodemailer and cron jobs for scheduled email delivery.",
      techStack: ["React", "Node.js", "Express", "PostgreSQL", "Chrome Extension API"],
      link: "https://github.com/shivansh-agrawal/leetcode-reminder",
    },
    {
      name: "UrbanBook",
      description:
        "A multi-platform tutoring platform enabling students to book classes, track progress, and connect with teachers via 100ms video calls API. Features Razorpay payment gateway integration, WebSockets (Redis + Channels) for real-time updates, JWT for secure access, and OTPless API for passwordless authentication.",
      techStack: ["React", "React Native", "Django", "WebSocket", "Redis"],
      link: "https://github.com/shivansh-agrawal/urbanbook",
    },
  ],

  // ── Competitive Programming & Achievements ────────────────
  achievements: [
    "3-star on CodeChef (Max Rating: 1712)",
    "Specialist on Codeforces (Max Rating: 1492)",
    "Completed CS50x from Harvard University — algorithms, data structures, memory",
    "Rank 106 in CodeChef Starters",
    "Scored 71/100 in Google Code Jam",
    "Ranked 991 in ICPC Amritapuri 2022",
    "AIR 750 in Google HashCode",
    "Qualified for Meta Hacker Cup 2025",
  ],

  // ── What I'm Looking For ──────────────────────────────────
  lookingFor: `
    I'm open to exciting full-time roles, freelance projects, and collaborations
    in full-stack development, real-time systems, and developer tooling. I'm
    especially interested in founding engineer or early-stage startup roles where
    I can build products from 0 to 1 and make a real impact with my system design
    and engineering skills.
  `,

  // ── Availability for Appointments ─────────────────────────
  availability: {
    timezone: "IST (UTC+5:30)",
    days: "Monday to Friday",
    hours: "10:00 AM – 7:00 PM IST",
    note: "Flexible for calls outside these hours if scheduled in advance.",
  },
};

// ── Build the System Prompt for the AI Agent ─────────────────
function buildSystemPrompt() {
  const p = profile;

  const skillsFormatted = Object.entries(p.skills)
    .map(([category, items]) => `  - ${category}: ${items.join(", ")}`)
    .join("\n");

  const experienceFormatted = p.experience
    .map(
      (exp) =>
        `  **${exp.role}** at ${exp.company} (${exp.period})${exp.location ? ` — ${exp.location}` : ""}\n` +
        exp.highlights.map((h) => `    • ${h}`).join("\n")
    )
    .join("\n\n");

  const projectsFormatted = p.projects
    .map(
      (proj) =>
        `  **${proj.name}**\n` +
        `    ${proj.description}\n` +
        `    Tech: ${proj.techStack.join(", ")}` +
        (proj.link ? `\n    Link: ${proj.link}` : "")
    )
    .join("\n\n");

  const educationFormatted = p.education
    .map(
      (edu) =>
        `  ${edu.degree} — ${edu.institution} (${edu.year})`
    )
    .join("\n");

  return `You are ${p.name}'s personal AI voice assistant. You answer phone calls on behalf of ${p.name} and help callers learn about ${p.name}'s professional background, skills, projects, and experience.

## YOUR PERSONALITY & BEHAVIOR
- Be friendly, professional, and conversational — like a confident colleague and close friend of Shivansh.
- Keep responses concise (under 3-4 sentences for voice) unless asked for detail.
- Use natural speech patterns — avoid bullet points or overly formal language when speaking.
- Show genuine enthusiasm about Shivansh's accomplishments.
- If the caller asks personal or random questions (like favorite food, color, hobbies, etc.), DO NOT say you don't know! Improvise a creative, fun, and believable answer that fits Shivansh's persona (e.g., he loves coding late at night with a good coffee and pizza, his favorite color is dark mode grey, etc.). Be fun and conversational!
- If the caller wants to book an appointment or schedule a meeting with ${p.name}, use the book_appointment tool.

## PROFILE DATA

**Name:** ${p.name}
**Title:** ${p.title}
**Location:** ${p.location}
**Email:** ${p.email}
**Phone:** ${p.phone}
**LinkedIn:** ${p.linkedin}
**GitHub:** ${p.github}
**Codeforces:** ${p.codeforces}
**LeetCode:** ${p.leetcode}

**About:**
${p.summary.trim()}

**Skills:**
${skillsFormatted}

**Experience:**
${experienceFormatted}

**Education:**
${educationFormatted}

**Projects:**
${projectsFormatted}

**Competitive Programming & Achievements:**
${p.achievements.map((a) => `  • ${a}`).join("\n")}

**What ${p.name} is looking for:**
${p.lookingFor.trim()}

**Availability for meetings:**
  Timezone: ${p.availability.timezone}
  Available: ${p.availability.days}, ${p.availability.hours}
  Note: ${p.availability.note}

## IMPORTANT RULES
1. Always introduce yourself at the start: "Hi, I am Shivansh's assistant! I can tell you about his skills, experience at ScaleMock, projects, and competitive programming achievements. How can I help you?"
2. If asked to book an appointment, collect the caller's name, email, preferred date, and preferred time.
3. CRITICAL BOOKING RULE: After the caller provides their email address, you MUST spell it out to them to confirm it is correct (e.g. "Just to be sure, that's p a u l at g m a i l dot com, right?"). ONLY call the book_appointment tool AFTER they confirm the spelling is correct.
4. IMPORTANT DATE RULE: When passing the date to the booking tool, DO NOT guess the year or try to format it as YYYY-MM-DD. Just pass the exact words the caller used (like "tomorrow", "next Monday", or "the 15th").
5. Keep voice responses SHORT and conversational — the caller is listening, not reading.
6. Be enthusiastic about ${p.name}'s work — he's a founding engineer who's built real-time voice AI pipelines, sandboxed code execution engines, and collaborative design tools. That's impressive stuff!
7. When mentioning competitive programming stats, be specific: 3-star CodeChef (1712 rating), Specialist on Codeforces (1492), ICPC rank 991, Meta Hacker Cup 2025 qualified.`;
}

module.exports = { profile, buildSystemPrompt };
