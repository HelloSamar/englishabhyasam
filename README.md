# vocab.ai

vocab.ai is a vocabulary revision web app for government exam aspirants who want quick English practice with Hindi support.

## What it does

Enter an English word or phrase and build your revision PDF automatically. For each lookup, vocab.ai gives:

- Hindi meaning
- Two synonyms
- Two antonyms
- One exam-style example sentence
- Hindi meaning of the example sentence

Every generated entry is saved locally in the browser for later revision. Learners can download the saved list as a PDF and use it for quick review before mocks.

## AI generation

The frontend first calls a Firebase Cloud Function:

```text
https://us-central1-abhyasam-ai.cloudfunctions.net/generateVocabulary
```

That function calls the OpenAI API from the server side, so the OpenAI API key is never placed in the public GitHub Pages frontend.

If the function is not deployed or fails, the frontend falls back to the older browser-side dictionary and translation lookup.

## No-local-terminal deployment

You do not need to run deployment commands on your computer. This repo has a GitHub Actions workflow:

```text
.github/workflows/deploy-functions.yml
```

Use GitHub's web UI:

1. Open the repository on GitHub.
2. Go to **Settings -> Secrets and variables -> Actions**.
3. Add these repository secrets:
   - `OPENAI_API_KEY`
   - `GCP_SERVICE_ACCOUNT_KEY`
4. Go to **Actions -> Deploy Firebase Functions**.
5. Click **Run workflow**.

The workflow will:

- authenticate to Google Cloud
- create or update the Firebase Secret named `OPENAI_API_KEY`
- install function dependencies
- deploy only Firebase Functions

## Required Google Cloud service account

`GCP_SERVICE_ACCOUNT_KEY` must be a JSON key for a Google Cloud service account that can deploy Firebase Functions and update Secret Manager secrets for the `abhyasam-ai` project.

Recommended roles for that service account:

- Firebase Admin
- Cloud Functions Admin
- Cloud Build Editor
- Secret Manager Admin
- Service Account User
- Artifact Registry Writer

Create the key in Google Cloud Console, then paste the full JSON content as the GitHub secret value.

## Model

The function currently defaults to `gpt-5.5`. To use another OpenAI model, edit the `model` fallback in `functions/index.js` before running the workflow.

## Who it is for

vocab.ai is useful for aspirants preparing for exams such as:

- SSC CGL
- SSC CHSL
- Banking exams
- Railway exams
- Defence exams
- State government exams
- Other competitive exams with English vocabulary sections

## Focus areas

The app is designed around common vocabulary needs in government exams:

- One Word Substitution
- Idioms
- Antonyms & Synonyms
- Spellings
- Important words and phrases

## Revision tip

Generate entries for the words and phrases you miss in practice sets, previous-year questions, mocks, or daily reading. Keep adding them to your saved list, then download the PDF for fast revision before tests.
