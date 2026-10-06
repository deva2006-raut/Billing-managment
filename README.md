# 🧾 Billing Management System

A lightweight **product management & billing system** built with vanilla JavaScript — no frameworks, no build step. Just open `index.html` and go.

## ✨ Features

- 📦 **Product management** — add, edit, and track products with pricing
- 🧾 **Billing** — generate bills with automatic totals
- 💰 **Sales tracking** — record and browse sales history
- 📊 **Reports** — revenue and sales insights
- 🔐 **Authentication** — simple login-protected access
- 💾 **Local persistence** — data stored in the browser via `localStorage`

## 🛠️ Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | HTML, CSS, Vanilla JavaScript |
| Storage    | localStorage (browser)        |
| Build step | None ✅                       |

## 🚀 Getting Started

No installation needed:

```bash
git clone https://github.com/deva2006-raut/Billing-managment.git
cd Billing-managment
```

Then open **`index.html`** in your browser — or serve it locally:

```bash
npx serve .
# or
python -m http.server 8080
```

## 📁 Project Structure

```
├── index.html      # Main app shell
├── style.css       # Styling
├── app.js          # App bootstrap & routing
├── auth.js         # Login handling
├── products.js     # Product management
├── bills.js        # Billing logic
├── sales.js        # Sales recording
└── reports.js      # Reports & analytics
```

> ⚠️ Data is stored in your browser's `localStorage` — clearing browser data will reset the app.

## 🔗 Connect

- [LinkedIn — Devanshu Raut](https://www.linkedin.com/in/devanshu-raut-632167334/)

## 📄 License

MIT © 2026 Devanshu Raut
