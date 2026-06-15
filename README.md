# English Abhyasam

A small GitHub Pages site for one tool: Hindi Vocabulary Helper.

## Live links

Main site:

```text
https://hellosamar.github.io/englishabhyasam/
```

Vocabulary helper:

```text
https://hellosamar.github.io/englishabhyasam/vocab/
```

## What it does

The Vocabulary Helper lets a learner enter an English word or phrase and get:

- Hindi meaning
- Two synonyms
- Two antonyms
- Example sentence
- Hindi translation of the example
- Copyable AI prompt fallback

The app is static and browser-based. It uses public lookup and translation endpoints where available, plus built-in verified examples for selected words and phrases.

## Repository structure

```text
englishabhyasam/
|-- index.html
|-- vocab/
|   `-- index.html
|-- .github/
|   `-- workflows/
|       `-- pages.yml
|-- .nojekyll
`-- README.md
```

## Deployment

This repo is configured for GitHub Pages through GitHub Actions.

Expected setting:

```text
Settings > Pages > Source > GitHub Actions
```

Workflow file:

```text
.github/workflows/pages.yml
```

## Notes

- Do not commit API keys.
- GitHub Pages is frontend-only.
- For full AI generation inside the page, add a small backend later.
