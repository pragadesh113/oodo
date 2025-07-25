# Project Documentation for ReWear - Community Clothing Exchange

## Project Overview

**Project Title**: ReWear - Community Clothing Exchange

**Description**:  
Develop ReWear, a web-based platform that enables users to exchange unused clothing through direct swaps or a point-based redemption system. The goal is to promote sustainable fashion and reduce textile waste by encouraging users to reuse wearable garments instead of discarding them. The platform will serve environmentally conscious individuals seeking to swap clothes, earn points, and contribute to a circular economy in fashion.

**Objectives**:  
- Build a user-friendly web application for clothing swaps and point-based redemptions.  
- Promote sustainability by facilitating garment reuse.  
- Provide a secure and efficient system for user authentication, item listing, and swap management.  
- Offer an admin interface for moderating content and ensuring platform integrity.

**Target Audience**:  
- Environmentally conscious individuals interested in sustainable fashion.  
- Users with unused clothing willing to swap or redeem points.  
- Admin users responsible for managing listings and platform oversight.

## Features

The ReWear platform will include the following features:  

1. **User Authentication**  
   - Email/password signup and login process.  
   - Secure storage of user credentials with password hashing.  
   - Optional social login integration (e.g., Google, Facebook) redirecting to the dashboard upon success.  

2. **Landing Page**  
   - Platform introduction with a mission statement on sustainable fashion.  
   - Calls-to-action: “Start Swapping”, “Browse Items”, “List an Item”.  
   - Featured items carousel showcasing popular or recently added listings.  

3. **User Dashboard**  
   - Display profile details (e.g., username, email) and current points balance.  
   - Overview of uploaded items with thumbnails and statuses.  
   - List of ongoing and completed swaps with details (e.g., item, status, date).  

4. **Item Detail Page**  
   - Image gallery with multiple images of the item.  
   - Full item description including title, category, size, condition, and tags.  
   - Uploader information (username, join date).  
   - Options: “Swap Request” button for direct swaps, “Redeem via Points” for point-based exchanges.  
   - Item availability status (e.g., Available, Pending Swap, Redeemed).  

5. **Add New Item Page**  
   - Upload multiple images of the item.  
   - Form fields: title, description, category (e.g., tops, bottoms), type (e.g., shirt, jeans), size (e.g., S, M, L), condition (e.g., new, used), and tags (e.g., casual, formal).  
   - Submit button to list the item for swapping or redemption.  

6. **Admin Role**  
   - Moderate and approve/reject item listings to ensure quality and appropriateness.  
   - Remove inappropriate or spam items from the platform.  
   - Lightweight admin panel for oversight, including user and item management tools.

## Technical Requirements

**Frontend**:  
- Framework: React with JSX for dynamic UI components.  
- Styling: Tailwind CSS for responsive and modern design.  
- CDN-hosted dependencies: Use `cdn.jsdelivr.net` for React, ReactDOM, and other libraries.  
- No `<form>` onSubmit due to sandbox restrictions; use button click handlers instead.  
- Use `className` instead of `class` for JSX attributes.

**Backend**:  
- Framework: Node.js with Express.js for RESTful API.  
- Database: MongoDB for storing user profiles, item listings, and swap transactions.  
- Authentication: JWT-based authentication for secure user and admin access.  
- Hosting: Deployable on platforms like Vercel or Heroku.

**APIs**:  
- User API: Handle signup, login, and profile updates.  
- Item API: CRUD operations for item listings (create, read, update, delete).  
- Swap API: Manage swap requests and point redemptions.  
- Admin API: Approve/reject items and manage user roles.

**Performance and Scalability**:  
- Optimize for up to 5,000 concurrent users.  
- Use lazy loading for item images in the carousel and listings.  
- Implement caching (e.g., Redis) for frequently accessed data like featured items.

**Security**:  
- HTTPS for secure communication.  
- Input validation and sanitization to prevent XSS and injection attacks.  
- Secure storage of user data and points balance.

## Web Flow Diagram Description

The ReWear web application follows a structured flow based on the provided wireframe diagram (Screens 1-7):  

1. **Screen 1: Landing Page**  
   - Displays a welcoming introduction to ReWear’s mission.  
   - Includes a “Start Swapping”, “Browse Items”, and “List an Item” call-to-action buttons.  
   - Features a carousel of highlighted items.  
   - Flow: User lands on the page → Clicks a call-to-action → Redirects to Login Page (Screen 2), Item Listing (Screen 5), or Add New Item Page (Screen 6).  

2. **Screen 2: Login Page**  
   - Contains fields for username and password.  
   - “Login” button to authenticate users.  
   - Flow: User enters credentials → Clicks “Login” → Redirects to User Dashboard (Screen 6) on success, or shows error on failure.  

3. **Screen 3: Registration Page**  
   - Includes fields for email, password, and optional confirmation fields.  
   - “Register” button to create a new account.  
   - Optional social login option redirects to dashboard upon success.  
   - Flow: User fills fields → Clicks “Register” → Redirects to Login Page (Screen 2) or dashboard if auto-logged in.  

4. **Screen 4: Landing Page (Alternative View)**  
   - Mirrors Screen 1 with navigation links (Home, Browse, Login, Sign Up).  
   - Hero section with CTA buttons and a carousel.  
   - Testimonials or featured clothing items section.  
   - Flow: User navigates via links → Redirects to respective pages (e.g., Item Listing).  

5. **Screen 5: Item Listing**  
   - Displays a grid of product listings with thumbnails.  
   - Search and filter options (e.g., category, size).  
   - Flow: User selects an item → Redirects to Item Detail Page (Screen 7).  

6. **Screen 6: User Dashboard**  
   - Shows profile details and points balance at the top.  
   - Tabs for “My Listings” (grid of uploaded items) and “My Purchases” (grid of swapped/redeemed items).  
   - Flow: User navigates tabs → Views or manages listings/purchases → Clicks an item → Redirects to Item Detail Page (Screen 7).  

7. **Screen 7: Product Detail Page**  
   - Displays an image gallery and detailed description (title, category, size, condition, tags).  
   - Shows uploader info and availability status.  
   - Buttons for “Swap Request” or “Redeem via Points”.  
   - Flow: User clicks “Swap Request” or “Redeem” → Processes request → Updates dashboard or shows confirmation.  

**Diagram Notes**:  
- Arrows indicate navigation paths between screens.  
- Conditional flows (e.g., login required for dashboard access) are enforced.  
- Error handling for invalid inputs (e.g., login failure) prompts retry or redirects to registration.

## Implementation Notes for Zencoder

- **File Structure**:  
  - `index.html`: Main entry point with React setup.  
  - `src/components/`: Reusable React components (e.g., `ItemCard`, `Carousel`, `DashboardTab`).  
  - `src/pages/`: Page components for Landing, Login, Registration, etc.  
  - `server/`: Backend code with Express.js routes and MongoDB integration.  
- **Dependencies**:  
  - Frontend: React (`https://cdn.jsdelivr.net/npm/react@18.2.0`), ReactDOM, Tailwind CSS.  
  - Backend: Express.js, Mongoose, JWT.  
- **Development Workflow**:  
  - Use modern JavaScript (ES6+) with Babel for JSX compilation.  
  - Test API endpoints (e.g., `/api/items`, `/api/swaps`) using Postman.  
  - Ensure responsive design with Tailwind CSS media queries.  
- **Assumptions**:  
  - Zencoder supports Node.js, MongoDB, and React-based web apps.  
  - The agent can handle CDN-hosted dependencies and RESTful API integration.  
- **Additional Instructions**:  
  - Avoid local file I/O; use API calls for image uploads.  
  - Implement point system logic in the backend (e.g., 1 item = 10 points).  
  - Ensure admin panel includes approval queues and removal actions.  

## Additional Notes

- **Testing**:  
  - Unit tests for React components using Jest.  
  - Integration tests for swap and redemption APIs.  
  - Browser compatibility for Chrome, Firefox, and Safari.  
- **Deployment**:  
  - Deploy frontend on Vercel and backend on Heroku.  
  - Configure environment variables for API keys and database credentials.  
- **Future Enhancements**:  
  - Add a chat feature for swap negotiations.  
  - Implement a reward system for frequent users.  
  - Integrate shipping options for non-local swaps.