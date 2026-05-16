# 🐍 Snake Classic

A modern, retro-styled web-based Snake game built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

Play it live: [GitHub Pages Deployment](https://abdullahad1.github.io/snake-game/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Fluid Controls** | Arrow keys or WASD for movement, Space to start/restart, P to pause |
| 🍎 **Progressive Speed** | Snake speeds up as you eat more food |
| 💾 **Persistent High Score** | Best score saved to browser localStorage |
| 🖥️ **CRT & Glow Effects** | Retro terminal aesthetic with scanlines and neon glow |
| 📱 **Responsive** | Clean centered layout on all screen sizes |
| ⚡ **Zero Backend** | Fully static — deploys anywhere (Vercel, GitHub Pages, Netlify) |

---

## 🚀 Play Locally

```bash
# Clone the repo
git clone https://github.com/Abdullahad1/snake-game.git
cd snake-game

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Project Structure

```
snake-game/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── SnakeGame.tsx    # Core game logic + renderer
│   │   ├── globals.css            # Tailwind imports + CRT styles
│   │   ├── layout.tsx             # Root layout + metadata
│   │   └── page.tsx               # Main page
│   └── ...
├── public/                        # Static assets
├── next.config.ts                 # Export + dist config
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🎨 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Design**: Retro Terminal / Game Boy aesthetic

## 🛡️ Security

- No external API calls
- No environment variables required
- No analytics or tracking
- Zero data leaves the browser

## 📄 License

MIT — feel free to fork, modify, and deploy.

---

Built with ⚡ using the [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) workflow.
