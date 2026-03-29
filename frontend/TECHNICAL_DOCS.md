# Vanik - Technical Documentation

## Architecture Overview

### Technology Stack
- **React 18.3.1** with JavaScript (JSX)
- **React Router 7.13.0** (Data mode)
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Sonner** for toast notifications
- **localStorage** for data persistence

### Project Structure

```
src/app/
├── components/
│   ├── ui/                    # Radix UI components (shadcn/ui)
│   ├── Navbar.jsx             # Navigation bar with language toggle
│   ├── FarmingIllustration.jsx # SVG illustration for landing page
│   ├── DemoNotice.jsx         # Demo mode notice component
│   └── design/                # Shared UI helpers (e.g. ImageWithFallback)
├── contexts/
│   └── AppContext.jsx         # Global state (user, language, translations)
├── layouts/
│   └── RootLayout.jsx         # Root layout with navbar
├── pages/
│   ├── Landing.jsx            # Landing page with role selection
│   ├── Signup.jsx             # Two-step signup (role + form)
│   ├── Login.jsx              # Login with role selector
│   ├── Dashboard.jsx          # Role-based dashboard
│   ├── CreatePost.jsx         # Create post (farmers only)
│   ├── BrowsePosts.jsx        # Browse all posts (buyers)
│   ├── MyPosts.jsx            # Farmer's posts list
│   ├── PostDetails.jsx        # Post details with bidding
│   ├── Bids.jsx               # Bids on farmer's posts
│   ├── MyBids.jsx             # Buyer's bid history
│   ├── Chat.jsx               # Chat interface
│   └── Messages.jsx           # Chat list
├── utils/
│   └── mockData.js            # Mock data seeder
├── routes.js                  # React Router configuration
└── App.jsx                    # Root component with providers
```

## Key Features

### 1. Role-Based Authentication
- Two user types: Farmer (👨‍🌾) and Buyer (👷)
- Role selected during signup
- Role-based UI and navigation
- Role badge displayed in navbar

### 2. Multi-Language Support
- English and Hindi translations
- Language toggle in navbar
- All UI text translated
- Language preference persisted

### 3. Post Management
**For Farmers:**
- Create posts for crops or services
- View all posts with bid counts
- Navigate to post details

**For Buyers:**
- Browse all available posts
- Filter by various criteria (future enhancement)
- View detailed post information

### 4. Bidding System (Boli)
- Buyers can place bids on posts
- Farmers see all bids with bidder information
- Direct chat from bid cards
- Bid history tracking

### 5. Chat System
- One-on-one messaging
- Message history persisted
- Chat initiated from bids
- Simple bubble interface

### 6. Data Persistence
All data stored in localStorage:
- `vanik_user` - Current user session
- `vanik_language` - Language preference
- `vanik_posts` - All posts
- `vanik_bids` - All bids
- `vanik_messages` - All chat messages

## Design System

### Color Palette (Earthy Theme)
```css
--primary: #2E7D32          /* Forest Green */
--secondary: #8D6E63        /* Brown */
--accent: #A0825A           /* Light Brown */
--background: #FAF9F6       /* Off White */
--muted: #F5F1E8            /* Light Beige */
--foreground: #2C2416       /* Dark Brown */
```

### Component Sizes
- Buttons: 48-56px height (h-12 to h-14)
- Inputs: 48-56px height
- Touch targets: Minimum 44x44px
- Border radius: 12px (0.75rem)
- Card shadows: Soft, elevated on hover

### Typography
- Base size: 16px
- Headings: Bold, clear hierarchy
- Body: Regular weight
- High contrast for readability

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## State Management

### Global State (AppContext)
```typescript
interface AppContextType {
  language: Language;        // 'en' | 'hi'
  setLanguage: (lang: Language) => void;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  t: (key: string) => string; // Translation function
}
```

### User Object
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer';
}
```

## Routing

### Public Routes
- `/` - Landing page
- `/signup` - Signup with role selection
- `/login` - Login with role selector

### Protected Routes
- `/dashboard` - Role-based dashboard
- `/create-post` - Create post (farmers only)
- `/browse` - Browse posts (buyers)
- `/my-posts` - Farmer's posts
- `/my-bids` - Buyer's bids
- `/post/:id` - Post details
- `/bids` - Farmer's received bids
- `/chat/:userId` - Chat interface
- `/messages` - Chat list

## Mock Data

### Seeded Data
- 3 mock farmers
- 2 mock buyers
- 5 sample posts (wheat, tomatoes, workers, seeds, onions)
- 4 sample bids
- Auto-seeded on first load

### Data Structures

**Post:**
```typescript
{
  id: string;
  title: string;
  description: string;
  price: string;           // Optional
  farmerId: string;
  farmerName: string;
  createdAt: string;
}
```

**Bid:**
```typescript
{
  id: string;
  postId: string;
  buyerId: string;
  buyerName: string;
  amount: string;
  createdAt: string;
}
```

**Message:**
```typescript
{
  id: string;
  chatId: string;          // Sorted user IDs: "user1-user2"
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}
```

## Accessibility Features

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Proper focus management

2. **Screen Reader Support**
   - Semantic HTML (nav, main, section)
   - ARIA labels where needed
   - Proper heading hierarchy

3. **Visual Design**
   - High contrast colors
   - Large touch targets (min 44x44px)
   - Clear visual feedback on interactions

4. **Low Literacy Support**
   - More icons, less text
   - Simple language
   - Visual hierarchy
   - Emojis for quick recognition

## Future Enhancements

### Backend Integration (Supabase Recommended)
1. **Authentication**
   - Email/password auth
   - Role-based access control
   - Session management

2. **Database Schema**
   ```sql
   users (id, name, email, role, created_at)
   posts (id, farmer_id, title, description, price, created_at)
   bids (id, post_id, buyer_id, amount, created_at)
   messages (id, chat_id, sender_id, text, created_at)
   ```

3. **Real-time Features**
   - Live chat updates
   - Bid notifications
   - Post updates

4. **Additional Features**
   - Image upload for crops
   - Location-based filtering
   - Payment integration
   - Rating system
   - Search and filters
   - Push notifications

### Performance Optimizations
- Image optimization
- Code splitting
- Lazy loading
- Service worker for offline support

### Security Considerations
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting
- Data encryption

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## License
Demo application for educational purposes.
