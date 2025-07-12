# ReWear - Community Clothing Exchange Setup Guide

## Firebase Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "rewear-community" (or your preferred name)
4. Continue through the setup process

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable "Google" sign-in for social login

### 3. Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 4. Enable Storage

1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as your Firestore
5. Click "Done"

### 5. Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Give your app a name: "ReWear Web App"
5. Copy the Firebase configuration object

### 6. Update Configuration

Open `index.html` and replace the placeholder configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 7. Set Up Firestore Security Rules

In the Firestore "Rules" tab, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow reading other users for display purposes
    }
    
    // Items can be read by anyone, written by authenticated users
    match /items/{itemId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
    }
    
    // Swaps can be read/written by involved parties
    match /swaps/{swapId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.uid == resource.data.ownerId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true
      );
      allow create: if request.auth != null;
    }
  }
}
```

### 8. Set Up Storage Security Rules

In the Storage "Rules" tab, replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 9. Create Admin User

1. Open the app and register a new user
2. Go to Firestore Database
3. Find the user document in the "users" collection
4. Edit the document and set `isAdmin: true`

## Running the Application

1. Open `index.html` in a web browser
2. The app should load with Firebase integration
3. You can now:
   - Register new users
   - Login/logout
   - Add items
   - Browse items
   - Make swap requests
   - Redeem items with points
   - Access admin panel (if admin user)

## Features Included

### User Features
- ✅ Email/password authentication
- ✅ User registration and login
- ✅ User dashboard with stats
- ✅ Browse items with filters
- ✅ View item details
- ✅ Add new items with image upload
- ✅ Swap requests
- ✅ Points-based redemption system
- ✅ Responsive design with Tailwind CSS

### Admin Features
- ✅ Admin panel access
- ✅ Item approval/rejection
- ✅ User management
- ✅ Swap request monitoring
- ✅ User role management

### Technical Features
- ✅ Firebase Authentication
- ✅ Firestore database
- ✅ Firebase Storage for images
- ✅ Real-time data updates
- ✅ Responsive design
- ✅ CDN-hosted React
- ✅ Security rules implemented

## Database Collections

### users
- `username`: string
- `email`: string
- `points`: number
- `joinDate`: timestamp
- `isAdmin`: boolean

### items
- `title`: string
- `description`: string
- `category`: string
- `type`: string
- `size`: string
- `condition`: string
- `tags`: array
- `images`: array of URLs
- `points`: number
- `userId`: string
- `userName`: string
- `status`: string (available, pending, redeemed, rejected)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### swaps
- `itemId`: string
- `itemTitle`: string
- `ownerId`: string
- `userId`: string
- `userName`: string
- `status`: string (pending, completed, cancelled)
- `type`: string (swap, points)
- `points`: number (for point redemptions)
- `date`: timestamp
- `message`: string

## Customization

You can customize the app by:
- Changing colors in the Tailwind config section of `index.html`
- Modifying the points calculation logic in `AddItemPage.js`
- Adding new item categories in the respective components
- Updating the UI components for different styling

## Troubleshooting

1. **Firebase connection issues**: Check console for authentication errors
2. **Image upload fails**: Verify Storage rules and authentication
3. **Admin panel not accessible**: Ensure user has `isAdmin: true` in Firestore
4. **Data not loading**: Check Firestore rules and network connectivity

## Production Deployment

For production:
1. Update Firestore rules to be more restrictive
2. Set up proper environment variables for Firebase config
3. Enable Firebase App Check for additional security
4. Configure proper CORS settings
5. Set up Firebase Hosting for deployment