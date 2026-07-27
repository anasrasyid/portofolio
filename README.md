# Anas Rasyid — Game Programmer Portfolio

This is a small static portfolio site intended for recruiters. Files:

- `index.html` — single-page portfolio
- `styles.css`, `script.js` — styles and theme toggle
- `Resume_Anas Rasyid.pdf` — attached resume (already present in the folder)


Deploy to GitHub Pages (quick):

1. Create a new repository on GitHub and push these files to the `main` branch.
2. In repository Settings → Pages, select branch `main` and folder `/ (root)` and save.
3. Optionally use `gh-pages` branch or `/docs` folder if you prefer.

Commands (local):

```bash
git init
git add .
git commit -m "Add portfolio site"
git branch -M main
git remote add origin git@github.com:yourusername/yourrepo.git
git push -u origin main
```

Data-driven content

- Edit `data/site.json` to update name, headline, contact, skills, experience and education.
- Add or edit `data/projects.json` to add or update project cards with: `title`, `description`, `details`, `studio`, `period`, `image`, and `stores`.
- `stores` is an array, for example: `[ { "platform": "Steam", "url": "https://..." }, { "platform": "Nintendo Switch", "url": "https://..." } ]`.

Notes:
- The site loads content from the `/data` files at runtime. When previewing locally via `file://` some browsers block fetch; use a simple static server (examples below) or push to GitHub Pages.
- Resume file is linked from the header; keep the filename `Resume_Anas Rasyid.pdf` or update `data/site.json`.

Quick local preview (Python):

```bash
python -m http.server 8000
# then open http://localhost:8000
```

