# AI Daily News

An [Engoo Daily News](https://engoo.com/app/daily-news)–style web app, focused entirely on the **latest AI news**. It turns artificial-intelligence headlines into bite-sized English lessons for learners.

Each lesson follows the classic Engoo format:

1. **Article** — a short, leveled news story (with one-tap audio playback).
2. **Comprehension quiz** — interactive multiple-choice questions with instant scoring; a perfect score completes the lesson automatically.
3. **Vocabulary** — key words with pronunciation, part of speech, definition, and an example you can listen to.
4. **Discussion** — speaking questions, plus a "Further discussion" set for advanced learners.

## Features

- 📰 Browsable **Daily News feed** of AI stories (Technology, Business, Science, Education, Society, Health).
- 🎚️ Filter by **difficulty band** (Beginner → Proficient, on Engoo's 1–10 level scale) and topic, plus full-text search.
- ❓ **Comprehension quiz** on every lesson, with instant feedback and a "try again" option.
- 🔊 **Listen** to articles and example sentences using the browser's built-in text-to-speech.
- ✅ **Progress tracking** — mark lessons complete; saved in `localStorage`.
- 📱 Responsive, modern UI built with Tailwind CSS.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- [React Router](https://reactrouter.com/) (HashRouter for static hosting)
- [Tailwind CSS](https://tailwindcss.com/)
- Web Speech API for audio

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5174)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  data/lessons.js        # AI news lesson content (article, vocab, discussion)
  lib/speech.js          # Web Speech API wrapper
  lib/progress.js        # localStorage progress hook
  components/            # Navbar, LessonCard, Filters, Vocabulary, ...
  pages/                 # Home (feed) and Lesson (detail)
```

## Notes

This is a demo/clone for learning purposes, inspired by Engoo's Daily News
product. The articles are original, illustrative summaries written for the app
and are not affiliated with Engoo.
