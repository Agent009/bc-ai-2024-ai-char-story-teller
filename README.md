# Encode_AI-and-GPT-Bootcamp-Q3-2024

Week 3 Group Project: Building a Multi-Character Storytelling Application

## Instructions / README

- [Lesson-12 / Weekend Project](https://github.com/Encode-Club-AI-Bootcamp/Generative-AI-Applications/tree/main/Lesson-12#weekend-project)

**Uses a list of characters and their associated backstories to generate a story.**

## Setup

Copy `.env` and create your `.env.local` file, replacing placeholder values with actual values.

## Running

```bash
npm i
npm run dev
```

Open [http://localhost:3091](http://localhost:3091) with your browser to see the result.

## Running with local OpenAI

Start the local OpenAI server such as [text-generation-webui](https://github.com/oobabooga/text-generation-webui), ensuring the API is accessible. For `text-generation-webui`, this can be done via the `--api` flag. The local OpenAI server should be accessible at something like: `http://localhost:5000/v1`.

Then, update `.env.local` with the correct base URL and API key (if required).

Then, navigate to the [route.ts](./src/app/api/chat/route.ts) file and uncomment the `createOpenAI` line.
For best results, use a low-latency models such as `llama-2-7b-chat.Q4_0.gguf`.

## Resources

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

- [GitHub Repo - Encode-Club-AI-Bootcamp / Generative-AI-Applications](https://github.com/Encode-Club-AI-Bootcamp/Generative-AI-Applications)
