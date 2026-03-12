module.exports = {
  apps: [{
    name: "voice-ai-booking-server",
    script: "./src/booking-server.js",
    env: {
      NODE_ENV: "production",
      PORT: 80
    }
  }]
}
