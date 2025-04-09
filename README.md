# Assignment-1

A simple React + Vite + Tailwind CSS boilerplate project.

## 🚀 Live Demo

[Click to View Live Project](https://assignment-1-sinha004.vercel.app)

## 🛠 Tech Stack

- **Frontend Framework**: React
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📂 Folder Structure

```
Assignment-1/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sinha004/Assignment-1.git
cd Assignment-1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

> App runs at `http://localhost:5173`

## 🔧 Available Scripts

| Script            | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Starts the Vite development server |
| `npm run build`   | Builds the app for production      |
| `npm run preview` | Serves the built app locally       |

## ⚙️ Tailwind Setup

Tailwind is configured in:

- `tailwind.config.js`
- `postcss.config.js`

And imported in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Make sure `index.css` is imported into `main.jsx`.

## 🧱 Vite HTML Setup

In `index.html`, this script is essential:

```html
<script type="module" src="/src/main.jsx"></script>
```

Ensure the file path is correct or Vite will throw a `Failed to resolve` error.

## 🐞 Common Vercel Error

If you see:

```
[vite:build-html] Failed to resolve /src/main.jsx from /vercel/path0/index.html
```

✅ Fix by:
- Making sure `src/main.jsx` exists
- Double-checking that `index.html` points to the correct path (case-sensitive)

## ✍️ Author

**Pulkit Sinha**  
[GitHub Profile](https://github.com/sinha004)
