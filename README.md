# vocab.ai

A single-purpose vocabulary web app for English learners who want quick Hindi support.

## Goal

A user enters an English word or phrase. The app returns:

- Hindi meaning
- Two synonyms
- Two antonyms
- One example sentence
- Hindi meaning of the example sentence

Every generated entry is saved in the browser so the learner can review previous searches and download them later as a PDF.

## Live site

After GitHub Pages is enabled, the site is available at:

```text
https://hellosamar.github.io/vocab.ai/
```

Repository:

```text
https://github.com/HelloSamar/vocab.ai
```

## Files kept in this repository

```text
index.html
README.md
.github/workflows/pages.yml
.nojekyll
```

Everything unrelated to the vocabulary app has been removed from the active `main` branch.

## Features

- Browser-based lookup
- Hindi meaning for the searched word or phrase
- Two synonyms and two antonyms
- Example sentence
- Hindi meaning of the example sentence
- Local search history using `localStorage`
- Download saved entries as PDF
- Download saved entries as JSON backup
- Clear saved history
- Works as a static GitHub Pages site

## Data storage

Saved lookups are stored locally in the user's browser with `localStorage`. They are not stored on a server.

## Deployment

GitHub Pages deployment is handled by:

```text
.github/workflows/pages.yml
```

Use GitHub repo settings if needed:

```text
Settings -> Pages -> Source -> GitHub Actions
```

## Note about accuracy

This is a static frontend app. It uses public browser-side lookup services where available and built-in examples for common words. For perfect AI-quality results for every phrase, connect a small backend API later.
