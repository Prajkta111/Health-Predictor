# Authentication Setup Documentation

## 🔐 Authentication Implementation

This documentation covers the authentication system implemented for the Health Predictor application.

### ✅ **Requirements Met:**

1. ✅ **Predictions work freely without authentication**
2. ✅ **Authentication only required for Login/Signup pages**
3. ✅ **Simple JWT-based authentication using NextAuth.js**
4. ✅ **Auth isolated to `(auth)` route group**
5. ✅ **No interruption to prediction functionality**
6. ✅ **Hooks prepared for history and pro features**
7. ✅ **Styled card/bubble UI for auth forms**

### 🏗️ **Architecture:**

```
web/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth configuration
│   ├── (auth)/                         # Route group (isolated auth)
│   │   ├── login/page.tsx               # Login page
│   │   └── signup/page.tsx              # Signup page
│   └── layout.tsx                       # Root layout with AuthProvider
├── components/
│   ├── auth-provider.tsx                # Session provider wrapper
│   ├── user-menu.tsx                    # User dropdown menu
│   └── prediction-with-auth.tsx         # Demo auth integration
└── hooks/
    └── use-auth.ts                      # Auth hooks (current & future)
```

### 🎯 **Key Features:**

#### **1. Free Predictions**
- All prediction APIs (`/api/predict`) work without authentication
- No middleware blocking prediction routes
- Users can use the app completely anonymously

#### **2. Isolated Authentication**
- Auth pages are in `(auth)` route group
- Only affects `/login` and `/signup` routes
- No impact on main app functionality

#### **3. NextAuth.js Setup**
- JWT-based sessions (no database required)
- Credentials provider (demo accepts any email/password)
- Automatic session management

#### **4. Beautiful UI**
- Styled login/signup forms in card layouts
- Different gradients for each page
- Success animations and loading states
- "Continue without account" options

#### **5. Future-Ready Hooks**
- `useAuth()` - Current user state
- `usePredictionHistory()` - Save/load predictions
- `useProFeatures()` - Pro feature access control

### 🚀 **Usage Examples:**

#### **Basic Authentication Check**
```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <p>Continue as guest or <Link href="/login">sign in</Link></p>
      )}
    </div>
  );
}
```

#### **Save Prediction (Optional)**
```typescript
import { usePredictionHistory } from '@/hooks/use-auth';

function PredictionResult({ prediction }) {
  const { savePrediction, isLoading } = usePredictionHistory();
  
  const handleSave = () => {
    savePrediction(prediction); // Only works if authenticated
  };
  
  return (
    <div>
      <p>Prediction: {prediction.result}</p>
      <button onClick={handleSave} disabled={isLoading}>
        Save (optional)
      </button>
    </div>
  );
}
```

#### **User Menu Integration**
```typescript
import { UserMenu } from '@/components/user-menu';

function Navigation() {
  return (
    <nav>
      <div>Logo</div>
      <UserMenu /> {/* Shows sign in/up buttons or user dropdown */}
    </nav>
  );
}
```

### 🔧 **Configuration:**

#### **Environment Variables (.env.local)**
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

#### **Demo Authentication**
Currently accepts any email/password combination for demo purposes.
To implement real authentication:

1. **Database Integration:**
   ```typescript
   // In route.ts authorize function
   const user = await db.user.findUnique({
     where: { email: credentials.email }
   });
   ```

2. **Password Hashing:**
   ```typescript
   import bcrypt from 'bcryptjs';
   
   const isValid = await bcrypt.compare(
     credentials.password, 
     user.hashedPassword
   );
   ```

3. **OAuth Providers:**
   ```typescript
   import GoogleProvider from 'next-auth/providers/google';
   
   providers: [
     GoogleProvider({
       clientId: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     }),
     // ... existing credentials provider
   ]
   ```

### 📱 **Pages Overview:**

#### **Login Page (`/login`)**
- Blue gradient background
- Email/password form
- Loading states with spinners
- Links to signup and guest access
- Auto-redirect after successful login

#### **Signup Page (`/signup`)**
- Purple gradient background
- Full name, email, password, confirm password
- Success animation with auto-login
- Form validation (password length, match)
- Links to login and guest access

### 🎨 **UI Components:**

#### **Card-based Design**
- Centered layouts with gradient backgrounds
- Shadow effects for depth
- Consistent spacing and typography
- Mobile-responsive design

#### **User Menu**
- Avatar with initials fallback
- Dropdown with profile options
- Sign in/up buttons for guests
- Logout functionality

### 🔮 **Future Extensions:**

#### **1. Prediction History API**
```typescript
// /api/predictions/route.ts
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Save prediction to database
}
```

#### **2. Pro Features**
```typescript
// Database schema extension
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  subscription  String?   @default("free") // "free" | "pro"
  predictions   Prediction[]
}
```

#### **3. Social Login**
```typescript
// Add to providers array
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}),
GitHubProvider({
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
})
```

### ✅ **Testing:**

#### **1. Anonymous Usage**
- Visit prediction pages directly
- Use API endpoints without authentication
- Verify no redirects or blocks

#### **2. Authentication Flow**
- Test login with any email/password
- Test signup form validation
- Test logout functionality

#### **3. Integration**
- Test UserMenu component
- Test PredictionWithAuth component
- Verify auth hooks work correctly

### 🛠️ **Troubleshooting:**

#### **NextAuth Session Issues**
```bash
# Clear browser storage
localStorage.clear();
sessionStorage.clear();

# Check environment variables
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
```

#### **Build Errors**
```bash
# Type errors
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run build
```

### 🎯 **Summary:**

The authentication system is:
- ✅ **Non-intrusive** - Predictions work freely
- ✅ **Isolated** - Only affects auth routes
- ✅ **Extensible** - Ready for future features
- ✅ **Beautiful** - Styled card interfaces
- ✅ **Simple** - JWT-based with NextAuth.js

Perfect balance of functionality and user experience!
