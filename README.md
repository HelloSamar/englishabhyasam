# English Abhyasam

A free English practice website for government exam aspirants. The current live build focuses on vocabulary support, including Hindi meanings, synonyms, antonyms, and example sentences.

## Live site

```text
https://hellosamar.github.io/englishabhyasam/
```

Vocabulary helper:

```text
https://hellosamar.github.io/englishabhyasam/vocab/
```

## Current structure

```text
englishabhyasam/
├── index.html                  # Clean landing page
├── vocab/
│   └── index.html              # Hindi Vocabulary Helper
├── .github/
│   └── workflows/
│       └── pages.yml           # GitHub Pages deployment workflow
├── .nojekyll                   # Keeps GitHub Pages from running Jekyll
└── README.md
```

## Vocabulary Helper

The vocabulary tool lets a learner enter an English word or phrase and get:

- Hindi meaning
- Two synonyms
- Two antonyms
- Example sentence
- Hindi translation of the example
- Copyable AI prompt fallback

The page is static and browser-based. It uses public lookup/translation endpoints when available, plus built-in verified examples for selected words. For idioms, phrases, and exam-specific nuance, the copyable AI prompt should be used for the most accurate result.

## Deployment

This repository is set up for GitHub Pages using GitHub Actions.

Expected Pages setting:

```text
Settings → Pages → Source → GitHub Actions
```

The workflow file is:

```text
.github/workflows/pages.yml
```

It deploys the full repository so both routes work:

- `/englishabhyasam/`
- `/englishabhyasam/vocab/`

## How to update the vocabulary app

Edit:

```text
vocab/index.html
```

Useful places inside the file:

- Built-in sample entries: `const data = { ... }`
- UI text: HTML section near the top of the file
- Lookup behavior: JavaScript functions near the bottom

## Roadmap

Planned sections can be added later without changing the current structure:

- Grammar lessons
- Curated synonym/antonym lists
- One-word substitution
- Idioms and phrases
- Editorial reading practice
- Mock tests

When those sections are added, update this README and the landing page links.

## Notes

- Keep the site simple, fast, and mobile-friendly.
- Avoid committing API keys. GitHub Pages is frontend-only.
- For full AI generation inside the page, add a small backend on Vercel, Netlify, or Cloudflare Workers.
