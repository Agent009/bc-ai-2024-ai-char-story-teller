// Environment
const environment = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV;
const localEnv = environment === "local";
const prodEnv = ["production", "prod"].includes(environment);
const devEnv = !localEnv && !prodEnv;
const devOrLocalEnv = devEnv || localEnv;
// Core Web App (CWA)
const cwaServerHost = process.env.CWA_SERVER_HOST || "http://localhost";
const cwaServerPort = process.env.CWA_SERVER_PORT || 3091;
const cwaServerUrl = process.env.NEXT_PUBLIC_CWA_SERVER_URL || `${cwaServerHost}:${cwaServerPort}`;

export const constants = Object.freeze({
  // Environment
  env: {
    dev: devEnv,
    local: localEnv,
    devOrLocal: devOrLocalEnv,
    prod: prodEnv,
  },
  // CWA
  cwa: {
    host: cwaServerHost,
    port: cwaServerPort,
    url: cwaServerUrl,
  },
  // 3rd Party, Integrations
  openAI: {
    useLocal: process.env.USE_LOCAL_AI === "true",
    localBaseURL: process.env.LOCAL_AI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    models: {
      chat: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      genImage: process.env.OPENAI_GEN_IMAGE_MODEL || "dall-e-2",
      genAudio: process.env.OPENAI_GEN_AUDIO_MODEL || "tts-1",
      genAudioVoice: process.env.OPENAI_GEN_AUDIO_VOICE || "alloy",
    },
    temperature: 0.5,
    maxTokens: 500,
    promptTypes: {
      chat: "chat",
      generateImage: "generateImage",
      generateAudio: "generateAudio",
    },
    response: {
      default: "default",
      streaming: "streaming",
    },
  },
  // Routes
  routes: {
    anchor: "#",
    home: "/",
    api: {
      base: "/api/",
      chat: "chat",
      evaluate: "evaluate",
      generateImage: "images",
      generateAudio: "audio",
    },
  },
});
