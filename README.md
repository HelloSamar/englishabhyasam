# abhyasam.ai

A focused revision workspace for government exam aspirants.

Organise syllabus progress, convert pasted notes into exam-focused revision data, and build English vocabulary lists with Hindi support.

## Current goal

The app is being built as a focused revision workspace. It currently has these sections:

- Syllabus
- General Studies
- English
- Mathematics
- Reasoning
- Computer

## Section plan

### Syllabus

A blank checklist area for now. Users can add syllabus topics, mark them completed, and see how many topics are ticked out of the total.

### General Studies

Users paste notes or raw content. The app organises the content from an SSC CGL and CHSL perspective.

Supported subject buckets:

- Geography - Physical, Indian, World
- History - Ancient, Medieval, Modern
- Science - Physics, Chemistry, Biology
- Polity
- Economics - Micro & Macro, Indian
- Environment
- Static GK
- Current Affairs

### English

Users choose one of these areas:

- One Word Substitution
- Idioms
- Antonyms & Synonyms
- Spellings
- Grammar

For English entries, the app keeps the existing revision workflow: Hindi meaning, two synonyms, two antonyms, exam-style example, Hindi meaning of the example, saved revision list, and PDF download.

### Mathematics and Reasoning

Users paste raw content, question text, or notes. The app converts it into cleaner revision structure.

### Computer

Users paste computer-awareness notes and organise them for exam revision.

## Sync

Firebase sync is now wired into the app.

Users can:

- Sign in with Google
- Save revision entries locally first
- Sync saved revision entries across devices
- Sync syllabus checklist progress across devices
- Keep using the app in local mode when signed out

Firestore path used by the app:

```text
users/{uid}/state/main
```

Recommended Firestore rules:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Firebase Console checklist:

- Authentication -> Google sign-in enabled
- Authentication -> Authorized domains includes `hellosamar.github.io`
- Firestore Database created
- Firestore rules published
