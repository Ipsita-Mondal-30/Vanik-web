# Vanik - Farmer Marketplace Platform

A clean, simple, and highly user-friendly marketplace platform designed for farmers and buyers in India. Vanik combines features similar to Upwork and OLX, with a focus on accessibility for users with low digital literacy.

## 🌾 Features

### Role-Based Authentication
- **Farmer Account**: Post crops for sale or request services
- **Buyer Account**: Browse posts, place bids, and offer services

### Core Functionality

#### For Farmers 👨‍🌾
- Create and manage posts for crops or service needs
- View all bids received on posts
- Chat directly with buyers
- Track post performance

#### For Buyers 👷
- Browse all available posts
- Place bids (boli) on posts
- Track bid history
- Direct messaging with farmers

### Multi-Language Support
- English and Hindi (हिंदी) toggle
- All interface text translated

### Design Highlights
- **Earthy Color Palette**: Green (#2E7D32), Brown (#8D6E63), Beige tones
- **Large Touch Targets**: Big buttons optimized for mobile
- **Clear Typography**: Easy to read for all literacy levels
- **Minimal Text, More Icons**: Visual-first interface
- **Mobile-First Design**: Fully responsive across all devices

## 🚀 Quick Start

### Mock Accounts for Testing

The application comes pre-seeded with demo data. You can create your own account or browse the existing posts immediately.

**To test as a Farmer:**
1. Click "I am a Farmer 👨‍🌾" on the landing page
2. Sign up with any email/password
3. Create posts, view bids, and chat with buyers

**To test as a Buyer:**
1. Click "I am a Buyer 👷" on the landing page
2. Sign up with any email/password
3. Browse posts, place bids, and start conversations

## 📱 Pages Overview

### 1. Landing Page
- Clear tagline: "Sell crops or find services easily"
- Large role selection cards (Farmer/Buyer)
- Language toggle (EN / हिंदी)
- Simple farming illustration

### 2. Signup Page
**Step 1**: Select your role with prominent card UI
**Step 2**: Enter Name, Email, Password with role displayed at top

### 3. Login Page
- Email + Password fields
- Role selector (Farmer/Buyer)
- Large, accessible form inputs

### 4. Dashboard (Role-Based)

**Farmer Dashboard:**
- Create Post
- My Posts
- View Bids
- Quick stats display

**Buyer Dashboard:**
- Browse Posts
- My Bids
- Messages
- Quick stats display

### 5. Create Post (Farmers Only)
- Title input
- Description textarea
- Optional price field
- Large submit button

### 6. Browse Posts (Buyers)
- Card-based list view
- Shows title, price, description
- Farmer name and post date
- "View Details" button

### 7. Post Details
- Full post information
- Bidding section for buyers
- Price display if set
- Navigate to bids (for post owners)

### 8. Bids Page (Farmers)
- List of all bids on farmer's posts
- Bidder name and amount
- "Chat" button for each bid
- Post title reference

### 9. My Bids (Buyers)
- Track all placed bids
- Post details
- Bid amount and date
- Link to view original post

### 10. Chat Page
- Simple message bubbles
- Clear sender identification
- Input field with send button
- Auto-scroll to latest message

### 11. Messages
- List of all conversations
- Shows last message preview
- Tap to open chat

## 🎨 Design System

### Colors
```css
Primary Green: #2E7D32
Secondary Brown: #8D6E63
Accent Brown: #A0825A
Background: #FAF9F6 (Off-white)
Muted: #F5F1E8 (Light beige)
```

### Typography
- Base font size: 16px
- Large buttons: 48-56px height
- Clear hierarchy with h1, h2, h3 tags
- High contrast for readability

### Components
- **Buttons**: Large (h-12 to h-14), rounded corners
- **Cards**: Rounded-2xl, soft shadows
- **Inputs**: Large (h-12 to h-14), clear labels
- **Role Badges**: Displayed in navbar with emoji + text

## 🔄 Data Persistence

All data is stored in browser localStorage:
- User authentication state
- Posts and bids
- Chat messages
- Language preference

## 🌐 Language Support

Toggle between English and Hindi in the navbar. All interface text is fully translated including:
- Navigation labels
- Form fields
- Button text
- Status messages

## 📦 Technology Stack

- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Sonner** for toast notifications

## 🎯 Target Audience

Designed specifically for:
- Farmers in rural India
- Agricultural buyers and traders
- Service providers and workers
- Users with varying levels of digital literacy

## 🔐 Note on Backend Integration

This is a frontend-only implementation using localStorage. For production use with real users:
- Connect to a backend API (Supabase recommended)
- Implement proper authentication
- Add real-time chat functionality
- Set up database for posts and bids
- Add image upload for crop photos

## 📄 License

This is a demo application created for educational purposes.
