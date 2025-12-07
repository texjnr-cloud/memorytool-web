/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

**Commit it**

---

## **FILE 4: .gitignore**

**Filename:** `.gitignore`

**Content:**
```
/node_modules
/.pnp
.pnp.js
/.next/
/out/
/build
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.vercel
.vscode
.idea
*.swp
*.swo
