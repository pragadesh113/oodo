# Security Setup for ReWear

## 🔒 Post-Download Configuration Required

After downloading this project, you **MUST** complete these security setup steps:

### 1. Firebase Configuration

1. **Create your Firebase project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Firebase in the app:**
   - Copy `src/config/firebase.config.template.js` to `src/config/firebase.config.js`
   - Update `firebase.config.js` with your actual Firebase configuration values
   - **Never commit firebase.config.js to version control**

3. **Set up Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Items are readable by all authenticated users
       match /items/{itemId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/items/$(itemId)).data.userId;
       }
       
       // Swaps involve two users
       match /swaps/{swapId} {
         allow read, write: if request.auth != null && 
           (request.auth.uid == get(/databases/$(database)/documents/swaps/$(swapId)).data.userId || 
            request.auth.uid == get(/databases/$(database)/documents/swaps/$(swapId)).data.ownerId);
       }
     }
   }
   ```

### 2. Admin Account Setup

1. **Create your admin account:**
   - Register normally through the app
   - In Firebase Console → Firestore → users collection
   - Find your user document and set `isAdmin: true`

2. **Remove demo admin credentials:**
   - The demo data includes `admin@rewear.com` - change or remove this in production

### 3. Environment Variables (Optional)

For enhanced security, consider using environment variables:

```javascript
// In firebase.config.js
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "fallback-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "project.firebaseapp.com",
  // ... other config
};
```

## ⚠️ Security Checklist Before Going Live

- [ ] Firebase config removed from public code
- [ ] Firestore security rules implemented
- [ ] Storage security rules configured
- [ ] Demo admin account secured/removed
- [ ] Environment variables configured
- [ ] HTTPS enabled for production
- [ ] Firebase Auth configured properly

## 🚨 What NOT to Commit to Git

- `src/config/firebase.config.js`
- Any files containing actual API keys
- Environment files (.env, .env.local, etc.)
- Firebase service account keys
- Database exports with real user data

## 🛡️ Production Security Tips

1. **Enable Firebase App Check** for additional security
2. **Set up proper CORS policies**
3. **Implement rate limiting**
4. **Regular security audits**
5. **Monitor Firebase usage and billing**

Remember: Security is an ongoing process, not a one-time setup!