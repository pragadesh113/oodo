# ReWear - Community Clothing Exchange

A sustainable fashion platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system.

## 🌱 About ReWear

ReWear promotes sustainable fashion by facilitating garment reuse through a community-driven platform. Users can list their unused clothing, browse items from others, and participate in a circular economy that reduces textile waste.

## ✨ Features

- **User Authentication** - Secure email/password registration and login
- **Item Management** - Add, edit, and manage clothing listings with multiple images
- **Smart Search & Filters** - Find items by category, size, condition, and more
- **Swap System** - Direct item swaps or point-based redemptions
- **Points Economy** - Earn points for listing items, spend them on redemptions
- **User Dashboard** - Track your listings, swaps, and points balance
- **Admin Panel** - Content moderation and user management tools
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Firebase project (see [SETUP.md](SETUP.md) for detailed instructions)

### Installation
1. Clone or download this repository
2. **🔒 IMPORTANT**: Complete security setup following [SECURITY_SETUP.md](SECURITY_SETUP.md)
3. Set up your Firebase project following [SETUP.md](SETUP.md)
4. Configure your Firebase credentials (see security setup)
5. Open `index.html` in your web browser

### First Time Setup
1. Register a new user account
2. In Firebase Console > Firestore > users collection, set `isAdmin: true` for your user to access admin features
3. Start adding items and exploring the platform!

## 📁 Project Structure

```
oodo/
├── index.html              # Main application entry point
├── src/
│   ├── App.js             # Main React application
│   ├── components/        # Page components
│   ├── services/          # Firebase integration
│   ├── utils/             # Helper functions
│   └── data/              # Demo data
├── SETUP.md               # Firebase setup guide
└── PROJECT_STRUCTURE.md   # Detailed technical documentation
```

## 🛠 Technology Stack

- **Frontend**: React 18 (CDN), Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Deployment**: Static hosting (Firebase Hosting, Vercel, etc.)

## 🎯 Key Features Breakdown

### For Users
- Browse and search clothing items
- List your own items with photos
- Request swaps or redeem with points
- Track your sustainability impact

### For Admins
- Moderate item listings
- Manage user accounts
- Monitor platform activity
- Control user permissions

## 🔧 Development

### Local Development
```bash
# Simple HTTP server (Python)
python -m http.server 8000

# Or use any static file server
npx live-server --port=8000
```

### Adding Demo Data
Uncomment the auto-load section in `src/data/demo.js` to populate the database with sample items for testing.

## 📱 Mobile Support

ReWear is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop computers

## 🌍 Sustainability Impact

Every swap on ReWear helps:
- ♻️ Reduce textile waste
- 🌱 Promote circular fashion
- 💚 Build sustainable communities
- 🌍 Lower environmental impact

## 📚 Documentation

- [Setup Guide](SETUP.md) - Firebase configuration and deployment
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed technical documentation
- [Original Requirements](document.md) - Project specifications

## 👥 Development Team

**Team Leader:** Pragadesh V  
**Team Members:** Kamalrani M, Thirumalaiselvi T, Lakshana N  
**College:** Thiagarajar College of Engineering, Madurai

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🚀 Live Demo

[Launch ReWear Demo](index.html) (Configure Firebase first)

---

**ReWear** - Building a sustainable future through community-driven fashion exchange 👗🔄🌱