# 📖 English Abhyasam

Free English preparation platform for government exam aspirants.
Built by Samar. Free. Always.

\---

## 📁 Folder Structure

```
englishabhyasam/
│
├── index.html               ← Homepage (rotating taglines, section overview)
├── journey.html             ← The Journey — Samar's story \& timeline
├── support.html             ← Support Us — personal branding + UPI + collaborate
│
├── assets/
│   ├── style.css            ← Shared styles (Inter font, all components)
│   ├── grammar-nav.js       ← Smart nav engine (breadcrumb, prev/next, progress)
│   └── logo.png             ← Your logo image
│
├── grammar/
│   ├── index.html           ← Auto-generates chapter list from manifest.js
│   ├── manifest.js          ← ✏️ ADD NEW TOPICS HERE
│   ├── 01.001.tenses-introduction.html
│   └── 01.002.simple-present-tense.html
│
├── vocab/
│   ├── index.html
│   ├── synonyms.html        ← Searchable table with set filters
│   └── quiz.html            ← Randomised vocab quiz
│
├── editorials/
│   ├── index.html
│   └── 001.india-digital-economy.html  ← Sample with highlighted vocab
│
└── tests/
    ├── index.html
    └── mock-01.html         ← Full 25Q timed test with score + review
```

\---

## 🚀 GitHub Pages Setup (Step by Step)

### 1\. Create GitHub account

→ https://github.com — sign up (free)

### 2\. Create new repository

* Click **+** → New repository
* Name: `englishabhyasam`
* Set to **Public**
* Click **Create repository**

### 3\. Upload files

* Click **uploading an existing file**
* Drag and drop the entire folder contents
* Commit message: "Initial upload"
* Click **Commit changes**

### 4\. Enable GitHub Pages

* Go to repo → **Settings** → **Pages**
* Source: **Deploy from branch**
* Branch: `main` | Folder: `/ (root)`
* Click **Save**

### 5\. Your site is live at:

```
https://YOUR-USERNAME.github.io/englishabhyasam/
```

### 6\. Custom domain (optional, \~₹800/year)

* Buy `englishabhyasam.com` from GoDaddy/Namecheap
* In GitHub Pages Settings → enter your custom domain
* In your domain's DNS → add CNAME pointing to `yourusername.github.io`

\---

## ✏️ How to Add Content

### Add a Grammar Topic

1. Create your HTML file in `/grammar/` folder

   * Name format: `01.003.simple-past-tense.html`
   * Copy `01.002.simple-present-tense.html` as your template
   * Change `data-file="..."` on the `<body>` tag to match the new filename
   * Edit the theory content and MCQ questions inside
2. Add the filename to `grammar/manifest.js` — in the correct order
3. Done. Breadcrumb, prev/next, and progress all update automatically.

### Add a Grammar Chapter

1. Start your chapter with a `XX.001.chapter-name-introduction.html` file
2. Add it (and subsequent topics) to `manifest.js`
3. The Grammar index page auto-detects it as a new chapter

### Add a Vocabulary Word (Synonyms table)

1. Open `vocab/synonyms.html`
2. Find `<tbody id="vocabBody">`
3. Copy any `<tr>` row and update: word, synonyms, antonyms, set number

### Add a Vocab Quiz Question

1. Open `vocab/quiz.html`
2. Find `var ALL\_Q=\[`
3. Copy any question object and fill in: `type`, `q`, `o` (4 options), `a` (correct index 0-3), `exp`

### Add a Mock Test

1. Copy `tests/mock-01.html` → rename `tests/mock-02.html`
2. Edit the `var Q=\[` array with new questions
3. Add a card in `tests/index.html` linking to the new file

### Add an Editorial

1. Copy `editorials/001.india-digital-economy.html` → rename `002.your-topic.html`
2. Edit the article content, highlighted words, and comprehension questions
3. Add a card in `editorials/index.html`

### Add Your UPI QR Code

1. Save your QR image as `assets/upi-qr.png`
2. Open `support.html`
3. Find the `<!-- ✏️ TO ADD YOUR QR -->` comment
4. Replace the placeholder div with:

```html
   <img src="assets/upi-qr.png" alt="UPI QR" style="width:150px;border-radius:12px;margin:0 auto 10px;display:block;border:1px solid var(--border)"/>
   ```

### Update Your UPI ID

1. Open `support.html`
2. Find `yourname@upi`
3. Replace with your actual UPI ID

### Update Your Email

1. Open `support.html`
2. Find all instances of `your@email.com`
3. Replace with your actual email address

\---

## 📊 Progress Tracking

* Progress is stored in the browser's `localStorage`
* Key: `ea\_grammar\_done`
* Students mark topics complete using the "Mark Complete" button
* Progress persists across browser sessions (on the same device)

\---

## 💰 Monetization (Later)

|Phase|Timeline|Action|
|-|-|-|
|Now|0–6 months|Free + UPI donations|
|Soon|6–12 months|Google AdSense (need \~10K visitors/month)|
|Later|12+ months|Google Login + Freemium model|

\---

## 🔗 Your Links

* Telegram: https://t.me/EnglishAbhyasam
* YouTube: https://www.youtube.com/@EnglishAbhyasam

\---

*Built with love \& passion by Samar. Free for every aspirant.*

