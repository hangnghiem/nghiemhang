# LocalGPT — a ChatGPT clone that runs on your machine

A polished ChatGPT-style chat app built with **Vite + React + Tailwind**. It talks
to a model running on your own computer via **[Ollama](https://ollama.com)**, or to
any **OpenAI-compatible API** (OpenAI, LM Studio, etc.). Everything — conversations,
settings — is stored locally in your browser.

![LocalGPT](https://img.shields.io/badge/runs-100%25%20local-10a37f)

## Features

- 💬 Streaming responses (token-by-token), with a **Stop** button
- 🗂️ Multiple conversations with rename, delete, and auto-titles
- 🧠 Two backends: **Ollama** (fully local) or any **OpenAI-compatible** endpoint
- ⚙️ Settings panel: provider, base URL, API key, model picker, temperature, system prompt
- 🔌 **Test connection** + automatic model discovery
- 📝 Markdown rendering with syntax-highlighted code blocks and one-click copy
- 🔁 Regenerate last response
- 💾 Persists to `localStorage` — nothing leaves your machine (except calls to your chosen model)
- 📱 Responsive, dark, ChatGPT-like UI

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Run a local model with Ollama (recommended)

Install [Ollama](https://ollama.com/download), then pull and serve a model:

```bash
ollama pull llama3.2
ollama serve        # exposes http://localhost:11434
```

> The app defaults to Ollama at `http://localhost:11434` with model `llama3.2`.
> Change the model in **Settings** (the sidebar shows discovered models).

### 3. Start the app

```bash
npm run dev
```

Open the URL Vite prints (default <http://localhost:5175>).

## Using an OpenAI-compatible API instead

Open **Settings → Provider → OpenAI-compatible** and set:

- **Base URL**: e.g. `https://api.openai.com` or your local server (LM Studio: `http://localhost:1234`)
- **API key**: your key (stored only in your browser's `localStorage`)
- **Model**: click **Test** to fetch the available models

## CORS note

Browsers enforce CORS. Ollama allows local web origins by default. If you hit CORS
errors, start Ollama with a permissive origin:

```bash
OLLAMA_ORIGINS=* ollama serve
```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Build for production (`dist`)|
| `npm run preview` | Preview the production build |

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm + rehype-highlight

## How it works

`src/lib/api.js` implements a single `streamChat()` that speaks both the Ollama
(`/api/chat`, newline-delimited JSON) and OpenAI (`/v1/chat/completions`, SSE)
streaming formats, normalizing them into incremental `onToken` callbacks. The UI
state (conversations + settings) lives in `App.jsx` and is mirrored to
`localStorage` via `src/lib/storage.js`.
