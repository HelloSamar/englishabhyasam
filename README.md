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

After GitHub Pages is enabled, the site will be available at:

```text
https://hellosamar.github.io/vocab.ai/
```

Current repository URL before manual rename:

```text
https://github.com/HelloSamar/englishabhyasam
```

## Files kept in this repository

```text
index.html
README.md
.github/workflows/pages.yml
.nojekyll
```

Everything unrelated to the vocabulary app should be removed.

## Features

- Browser-based lookup
- Local search history using `localStorage`
- Download saved entries as PDF
- Clear saved history
- Works as a static GitHub Pages site

## Note about accuracy

This is a static frontend app. It uses public browser-side lookup services where available and built-in examples for common words. For perfect AI-quality results for every phrase, connect a small backend API later.

## Rename repository to `vocab.ai`

This connector can edit repository files, but it does not expose repository rename settings. Rename manually in GitHub:

```text
Settings -> General -> Repository name -> vocab.ai -> Rename
```

Then set GitHub Pages source to GitHub Actions if needed.