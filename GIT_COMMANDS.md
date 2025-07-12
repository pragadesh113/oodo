# Git Commands for ReWear Competition Submission

## 🚀 Initial Repository Setup

### 1. Initialize Git (if not already done)
```bash
cd oodo
git init
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/rewear-competition.git
```

### 3. Check What Will Be Committed
```bash
git status
```

### 4. Review .gitignore (should exclude sensitive files)
```bash
cat .gitignore
```

### 5. Add All Safe Files
```bash
git add .
```

### 6. Verify What's Being Added
```bash
git status
```

### 7. Create Initial Commit
```bash
git commit -m "Initial commit: ReWear sustainable fashion platform

Features:
- React 18 + Firebase full-stack application
- User authentication and authorization
- Item listing and management system
- Dual exchange system (swaps + points)
- Admin panel for content moderation
- Mobile-responsive design
- Complete demo and testing tools

Tech Stack: React, Firebase, Tailwind CSS
Team: Pragadesh V, Kamalrani M, Thirumalaiselvi T, Lakshana N
College: Thiagarajar College of Engineering, Madurai"
```

### 8. Push to GitHub
```bash
git push -u origin main
```

## 🔄 Subsequent Updates

### Add Changes
```bash
git add .
git commit -m "Description of changes"
git push
```

## 🧪 Verify Push Success

### Check Remote Repository
```bash
git remote -v
git log --oneline
```

### Verify .gitignore is Working
```bash
# These should show "nothing to commit" if .gitignore is working:
git status
```

## ⚠️ Emergency Commands (if you accidentally commit sensitive files)

### Remove File from Git (keep local copy)
```bash
git rm --cached src/config/firebase.config.js
git commit -m "Remove sensitive Firebase config"
git push
```

### Remove from Git History (if already pushed)
```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch src/config/firebase.config.js' --prune-empty --tag-name-filter cat -- --all
git push --force
```

## 📋 Pre-Push Checklist

- [ ] .gitignore includes sensitive files
- [ ] No real Firebase config in any files
- [ ] Demo data sanitized
- [ ] Documentation complete
- [ ] README updated with setup instructions
- [ ] DEMO_GUIDE.md included for judges

## 🎯 Competition Repository Structure

Your GitHub repo will look like this:
```
rewear-competition/
├── 📄 README.md (Project overview)
├── 📄 DEMO_GUIDE.md (Judge instructions)
├── 📄 SECURITY_SETUP.md (Setup guide)
├── 📄 preview.html (Visual overview)
├── 📄 index.html (Main app)
├── 📄 test.html (Testing tool)
├── 📁 src/ (All source code)
├── 📁 assets/ (Images, etc.)
└── 📄 Various docs and configs
```

## 🏆 Repository Best Practices

### Good Commit Messages
```bash
git commit -m "Add user authentication system with Firebase Auth"
git commit -m "Implement points-based item exchange system"
git commit -m "Add responsive design for mobile devices"
git commit -m "Create admin panel for content moderation"
```

### Tags for Releases
```bash
git tag -a v1.0 -m "Competition submission version"
git push origin v1.0
```

## 🔗 Example Repository URLs

Replace with your actual GitHub username:
- Repository: `https://github.com/YOUR_USERNAME/rewear-competition`
- Live Demo: `https://YOUR_USERNAME.github.io/rewear-competition/preview.html`
- Testing Tool: `https://YOUR_USERNAME.github.io/rewear-competition/test.html`