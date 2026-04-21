# Hans — Personal Site

> Minimalist personal website for **Võ Tuấn Hùng (Hans)** — Junior Fullstack Developer based in Ho Chi Minh City, Vietnam.

🌐 **Live:** [hans-dev.eu.org](https://hans-dev.eu.org)

---

## ✨ Features

- **Bilingual** — Toggle between English 🇬🇧 and Vietnamese 🇻🇳 seamlessly
- **Dark / Light mode** — Respects system preference, switchable with one click
- **Typing animation** — Name animates on load with a blinking cursor
- **Availability badge** — Pulsing green dot signals open-to-work status
- **Smart date ranges** — Experience dates collapse intelligently (e.g. `Jul — Aug 2025` when same year)
- **Grouped projects** — Multiple projects in the same year share a single year label
- **SEO-ready** — Full Open Graph, Twitter Card, and canonical meta tags
- **Signature footer** — Dancing Script font with a hand-sign image

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Font | Inter (body) · Dancing Script (footer) |
| Hosting | Custom domain (`hans-dev.eu.org`) |

---

## 📂 Project Structure

```
Hans/
├── public/
│   ├── avt.png                  # Avatar photo
│   └── Hans Sign.png            # Signature image (footer)
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Avatar, name typing, availability, links
│   │   ├── Footer.jsx           # Signature + copyright
│   │   ├── Experience.jsx       # Work history with smart date logic
│   │   ├── Projects.jsx         # Projects grouped by year
│   │   ├── Section.jsx          # Reusable section wrapper
│   │   ├── LangToggle.jsx       # EN / VN language switch
│   │   └── ThemeToggle.jsx      # Dark / light mode toggle
│   ├── context/
│   │   ├── LanguageContext.jsx  # Global language state
│   │   └── ThemeContext.jsx     # Global theme state
│   ├── data/
│   │   ├── resume.json          # All personal / work / project data
│   │   └── translations.js      # UI string translations
│   ├── hooks/
│   │   └── useTypingEffect.js   # Character-by-character typing hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & run locally

```bash
# Clone the repo
git clone https://github.com/h4nsx/Hans.git
cd Hans

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## ✏️ Customization

All content lives in a single file — no database, no CMS.

**`src/data/resume.json`** — edit your personal info, experience, and projects:

```jsonc
{
  "personal": {
    "name": { "en": "Hans", "vn": "Võ Tuấn Hùng" },
    "role": { "en": "Junior Fullstack developer", "vn": "..." },
    "bio":  { "en": "...", "vn": "..." },
    "availability": { "available": true, "status": { "en": "Open to opportunities", "vn": "..." } },
    "links": [
      { "name": "GitHub", "url": "https://github.com/h4nsx" }
    ]
  },
  "experience": [
    {
      "startDate": "Jul 2025",   // or bare "2025"
      "endDate": "Aug 2025",     // leave "" for ongoing
      "company": "...",
      "role": { "en": "...", "vn": "..." },
      "location": "...",
      "url": "..."
    }
  ],
  "projects": [
    {
      "year": "2025",
      "name": "...",
      "description": { "en": "...", "vn": "..." },
      "url": "..."
    }
  ]
}
```

**UI strings** are in `src/data/translations.js`.

---

## 📄 License

MIT — free to use as a template. A credit or star is appreciated! ⭐
