# Voting System - Technical Interview Questions & Answer Approaches

## Table of Contents
1. [Architecture & System Design](#architecture--system-design)
2. [Frontend (React, Vite, Context API)](#frontend-react-vite-context-api)
3. [Backend (Node.js, Express)](#backend-nodejs-express)
4. [Database (MongoDB, Mongoose)](#database-mongodb-mongoose)
5. [Authentication & Security](#authentication--security)
6. [API Design & Integration](#api-design--integration)
7. [DevOps & Deployment](#devops--deployment)
8. [Best Practices & Code Quality](#best-practices--code-quality)

---

## Architecture & System Design

### Q1: Explain the overall architecture of the Voting System. What are the main components and how do they interact?

**How to Approach:**
1. **Start with a high-level overview** - Describe the three-tier architecture (Client, Server, Database)
2. **Explain data flow** - Trace a user journey from login to voting
3. **Mention communication** - How frontend communicates with backend (HTTP/REST API)
4. **Discuss separation of concerns** - Controllers, Services, Models, Routes, Middleware
5. **Mention specific technologies** - React for UI, Express for API, MongoDB for persistence

**Answer Structure:**
```
- Client Layer (React + Vite)
  ├─ Components (Login, Dashboard, Voting, Results)
  ├─ Context API (Auth state management)
  └─ Axios (API communication)

- Server Layer (Node.js + Express)
  ├─ Routes (Auth, Voting, Candidate)
  ├─ Controllers (Business logic)
  ├─ Middleware (Authentication, Validation)
  └─ Services (Utility functions)

- Database Layer (MongoDB)
  ├─ User Collection
  ├─ Candidate Collection
  └─ Vote tracking
```

**Key Points to Cover:**
- Request flow: Client → API Endpoint → Middleware → Controller → Model → Database
- Response flow: Database → Service → Controller → Response to Client
- Role-based access (Admin vs Voter)

---

### Q2: Why did the project use a microservices-like structure with separate Client and Server folders instead of a monolithic approach?

**How to Approach:**
1. **Explain scalability** - Each part can scale independently
2. **Discuss separation of concerns** - Frontend and backend have different requirements
3. **Mention deployment flexibility** - Different deployment strategies for client and server
4. **Talk about team structure** - Different teams can work on different parts
5. **Mention technology choices** - Different tech stacks for different layers

**Answer Structure:**
- **Monolithic disadvantages**: Tightly coupled code, harder to deploy, single point of failure
- **Microservices advantages**: Independent deployment, technology flexibility, easier testing
- **Practical benefits in voting system**: UI can be changed without touching backend, backend API is reusable

---

### Q3: How would you scale this application to handle thousands of concurrent voters?

**How to Approach:**
1. **Database optimization** - Indexing, sharding, replication
2. **Backend scaling** - Load balancing, clustering, horizontal scaling
3. **Frontend optimization** - CDN, caching, lazy loading
4. **Caching strategy** - Redis for candidate lists, vote counts
5. **Message queues** - Use message brokers (RabbitMQ, Kafka) for vote processing

**Answer Structure:**
```
Database Scaling:
- Use MongoDB replication sets
- Index frequently queried fields (adharNumber, candidateId)
- Consider sharding by candidateId or userId

Backend Scaling:
- Use load balancer (Nginx, AWS ELB)
- Deploy multiple Express instances
- Use Node cluster module
- Implement connection pooling

Frontend Optimization:
- Serve static files from CDN
- Implement service workers for offline capability
- Code splitting and lazy loading

Real-time Features:
- Use WebSockets (Socket.io) for live vote count updates
- Implement event-driven architecture
```

---

### Q4: What design patterns are used in this project? Can you identify and explain them?

**How to Approach:**
1. **MVC Pattern** - Models, Views, Controllers
2. **Service Layer Pattern** - Separation of business logic
3. **Middleware Pattern** - Authentication, validation
4. **Context Pattern** - React Context for state management
5. **Factory Pattern** - API object creation
6. **Singleton Pattern** - MongoDB connection, Express app

**Answer Structure:**
```
MVC:
- Model: User.model.js, Candidate.model.js
- View: React components
- Controller: auth.controller.js, voting.controllers.js

Service Layer:
- auth.service.js handles user creation logic
- Separation of database operations from API handlers

Middleware Pattern:
- auth.middleware.js for route protection
- express.json(), cors middleware for request processing

Context API Pattern:
- AuthContext.jsx for global auth state
- useAuth hook for consuming context

Factory Pattern:
- api.js creates axios instances for different API groups
```

---

## Frontend (React, Vite, Context API)

### Q5: Explain how the Context API is used in the AuthContext.jsx file. What problem does it solve?

**How to Approach:**
1. **Explain prop drilling problem** - Why Context API is needed
2. **Describe AuthContext structure** - Provider, context value, custom hook
3. **Explain useCallback optimization** - Why fetchProfile uses it
4. **Discuss derived state** - isAdmin, isVoter computed from role
5. **Mention lifecycle** - useEffect for initialization, fetchProfile on mount

**Answer Structure:**
```
Problem Solved:
- Without Context: props would need to pass through many components
- With Context: auth state is globally available

Structure:
- createContext() creates the context object
- AuthProvider wraps the app and provides value
- useAuth custom hook for consuming context
- useCallback memoizes fetchProfile to prevent infinite loops

Features:
- user: current user object
- loading: initial load state
- login/logout: state setters
- fetchProfile: async function to fetch user data
- isAdmin/isVoter: derived boolean values from role
```

**Key Points:**
- Context API is good for medium-sized apps, Redux for larger ones
- useCallback prevents unnecessary re-renders of child components
- The loading state prevents rendering before data is fetched

---

### Q6: What is React's StrictMode and how would you use it to catch bugs during development?

**How to Approach:**
1. **Explain StrictMode purpose** - Identifies potential issues
2. **Mention lifecycle double-invocation** - Helps catch side effect issues
3. **Discuss unmounting warnings** - Helps identify cleanup issues
4. **Explain development vs production** - Only in dev, removed in production
5. **Practical implementation** - Where to wrap components

**Answer Structure:**
```javascript
// In main.jsx or App.jsx
<React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</React.StrictMode>

Benefits:
1. Identifies components with unsafe lifecycles
2. Warns about legacy string refs
3. Warns about findDOMNode usage
4. Warns about deprecated lifecycles
5. Double-invokes certain functions to detect side effects
```

---

### Q7: How does the ProtectedRoute component work? What would you improve about it?

**How to Approach:**
1. **Explain current implementation** - How it checks authentication and role
2. **Discuss loading state** - Why it's necessary
3. **Mention edge cases** - What could break
4. **Suggest improvements** - Better error handling, permission checks
5. **Compare with alternatives** - Redirect strategies

**Current Implementation Analysis:**
```
Flow:
1. Check loading state → show spinner
2. Check user existence → redirect to login if null
3. Check adminOnly flag → redirect if not admin
4. Render children if all checks pass

Issues:
- Limited error feedback
- No retry mechanism for failed fetches
- No loading message for users
```

**Improvements:**
```javascript
// Better implementation
const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  requiredRole = null,
  fallback = '/login' 
}) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  if (!user) {
    return <Navigate to={fallback} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};
```

---

### Q8: Explain the component lifecycle and how useEffect is used in the Voting.jsx component.

**How to Approach:**
1. **Explain useEffect basics** - Dependency array, cleanup
2. **Walk through Voting.jsx** - What happens on mount, update, unmount
3. **Discuss dependencies** - Empty array means run once
4. **Mention state management** - Multiple useState calls
5. **Discuss optimization** - Can this be optimized?

**Answer Structure:**
```javascript
// In Voting.jsx
useEffect(() => {
  loadCandidates();  // Runs on component mount
}, []);  // Empty dependency array = run once

Lifecycle:
1. Mount: loadCandidates() is called
2. Update: selectedId, showConfirm changes trigger re-renders
3. Unmount: cleanup (not implemented here)

State Variables:
- candidates: loaded from API
- loading: UI feedback
- selectedId: selected candidate
- showConfirm: modal state
- voting: submission loading
- hasVoted: prevents double voting
```

**Optimizations:**
```javascript
// Add cleanup for pending requests
useEffect(() => {
  let isMounted = true;
  
  const loadCandidates = async () => {
    try {
      const res = await votingAPI.getCandidates();
      if (isMounted) setCandidates(res.data.candidates);
    } catch (err) {
      if (isMounted) handleError(err);
    }
  };
  
  loadCandidates();
  
  return () => {
    isMounted = false; // Cleanup to prevent memory leaks
  };
}, []);
```

---

### Q9: Why is the project using Vite instead of Create React App? What are the advantages?

**How to Approach:**
1. **Explain Vite benefits** - Speed, modern tooling, ES modules
2. **Compare with CRA** - CRA is slower, heavier
3. **Discuss dev experience** - HMR (Hot Module Replacement)
4. **Mention build performance** - Vite uses Rollup
5. **Talk about ecosystem** - Framework agnostic

**Answer Structure:**
```
Vite Advantages:
1. Speed
   - Lightning-fast dev server (milliseconds HMR)
   - Uses native ES modules during development
   - CRA uses Webpack (slower bundling)

2. Build Performance
   - Uses Rollup for production builds
   - Better tree-shaking
   - Smaller bundle sizes

3. Developer Experience
   - Instant server start
   - Fast HMR (changes appear instantly)
   - Better error feedback

4. Ecosystem
   - Framework agnostic
   - Smaller, more modern tooling
   - Better TypeScript support

5. Configuration
   - Simpler vite.config.js
   - Less magic than CRA
```

**Benchmarks:**
```
Dev Server Start:
- CRA: 2-5 seconds
- Vite: <100ms

Hot Module Replacement:
- CRA: 1-2 seconds
- Vite: <100ms

Production Build:
- CRA: ~30-60 seconds
- Vite: ~5-10 seconds
```

---

### Q10: How would you implement state management for a more complex voting scenario with voting history, notifications, and analytics?

**How to Approach:**
1. **Identify limitations of Context API** - Multiple dispatches, complex state
2. **Compare alternatives** - Redux, Zustand, Recoil
3. **Design store structure** - How to organize state
4. **Mention middleware** - For side effects like API calls
5. **Discuss dev tools** - Redux DevTools for debugging

**Answer Structure:**
```
Current Limitation:
- Context API works for simple auth state
- Complex features need better state management

Solution: Redux or Zustand

Redux Architecture:
```
Store:
├─ auth
│  ├─ user
│  ├─ isAuthenticated
│  └─ token
├─ voting
│  ├─ candidates
│  ├─ myVoteHistory
│  └─ hasVoted
├─ notifications
│  ├─ messages
│  └─ unread count
└─ analytics
   ├─ pageViews
   └─ engagement

Actions:
- SET_USER
- CAST_VOTE
- FETCH_VOTE_HISTORY
- ADD_NOTIFICATION
- TRACK_EVENT

Middleware:
- Redux Thunk/Saga for async operations
- Logger middleware for debugging
```

Alternative (Zustand - lighter):
```javascript
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  votes: [],
  notifications: [],
  
  setUser: (user) => set({ user }),
  castVote: (candidateId) => set((state) => ({
    votes: [...state.votes, candidateId]
  })),
  addNotification: (msg) => set((state) => ({
    notifications: [...state.notifications, msg]
  })),
}));
```

---

## Backend (Node.js, Express)

### Q11: Explain the middleware pattern used in the auth.middleware.js. Why is it important?

**How to Approach:**
1. **Explain middleware concept** - Functions that process requests
2. **Walk through protectRoute** - Token extraction, verification, user attachment
3. **Discuss execution order** - How middleware chains work
4. **Mention error handling** - What happens if verification fails
5. **Discuss best practices** - Security considerations

**Answer Structure:**
```javascript
// Middleware chain execution
app.post('/voting/:candidateId', protectRoute, voteToCandidate);
                                ^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^
                                   runs first       handler

Middleware Flow:
1. Request comes in
2. protectRoute middleware runs
3. If no token → 401 response (stops here)
4. If token valid → user attached to req
5. next() passes control to route handler
6. Route handler executes with req.user available

Key Functions:
1. Token extraction
   - From cookies (most secure)
   - From Authorization header (fallback)

2. Token verification
   - Checks signature with JWT_SECRET
   - Verifies expiration
   
3. User lookup
   - Fetches user from database
   - Excludes password field
   
4. Attaches user to request
   - req.user = user object
   - Available in subsequent handlers
```

**Security Benefits:**
- Protects routes from unauthorized access
- Single source of token validation logic
- Reusable across multiple routes
- Centralized error handling

---

### Q12: How does password hashing work in the User model? Why bcrypt instead of simple hashing?

**How to Approach:**
1. **Explain password hashing need** - Security reason
2. **Compare hashing vs encryption** - One-way process
3. **Discuss salt concept** - What makes bcrypt secure
4. **Explain bcrypt algorithm** - Bcrypt vs MD5/SHA
5. **Mention password comparison** - How login works

**Answer Structure:**
```
The Problem:
- Never store plain passwords in database
- If database is compromised, all passwords exposed
- Even admin shouldn't see passwords

Hashing vs Encryption:
- Hashing: one-way function (password → hash)
- Encryption: two-way function (plaintext ⟷ ciphertext)
- Passwords use hashing because they don't need to be decrypted

Why Bcrypt?
1. Salting
   - Random salt added to password before hashing
   - Same password = different hashes (because different salt)
   - Prevents rainbow table attacks

2. Cost Factor (bcrypt uses 10)
   - Controls hashing speed
   - Makes brute force attacks impractical
   - Takes ~100ms to hash one password

3. Adaptive
   - As computers get faster, can increase cost factor
   - Old hashes still validate correctly

Comparison:
MD5/SHA:      Fast but insecure (easily cracked)
Bcrypt:       Slow by design (security feature)
Argon2:       Better than bcrypt, newer

Implementation:
```

**Code Example:**
```javascript
// Signup - Hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Login - Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

Why Salt Matters:
- Without salt: password123 always hashes to "abc123..."
- With salt: password123 + random1 = "xyz789..."
                password123 + random2 = "def456..."
- Attacker can't use pre-computed rainbow table
```

---

### Q13: Explain the separation of concerns between controllers and services. Why is auth.service.js needed?

**How to Approach:**
1. **Explain controller responsibility** - Request handling, validation
2. **Explain service responsibility** - Business logic, reusable functions
3. **Show benefits** - DRY, testability, reusability
4. **Discuss testability** - Easier to test pure functions
5. **Mention when to use** - Not needed for trivial operations

**Answer Structure:**
```
Controller vs Service:

Controller Responsibility:
- Parse request parameters
- Validate input
- Call appropriate service
- Format response
- Handle HTTP status codes
- Middleware integration

Service Responsibility:
- Database operations
- Business logic
- Data transformation
- Error handling
- Reusable across controllers

Example Flow:
1. POST /signup hits signup controller
2. Controller validates input
3. Controller calls authService.createUser()
4. Service:
   - Checks if user exists
   - Hashes password
   - Creates user in DB
   - Returns user object
5. Controller formats response

Benefits:
1. Reusability
   - createUser() used in signup and admin creation
   - Can call from different routes

2. Testability
   - Service functions are pure (no HTTP)
   - Easy to test with mocked data

3. Separation of concerns
   - Controller handles HTTP
   - Service handles business logic

4. Maintenance
   - Business logic changes → only update service
   - HTTP format changes → only update controller

Example Service Function:
```

```javascript
// authService.createUser()
export const createUser = async (userData) => {
  // Pure business logic - no HTTP knowledge
  const hashedPassword = await hashPassword(userData.password);
  const user = new User({
    ...userData,
    password: hashedPassword
  });
  return await user.save();
};

// Reusable in multiple places
// signup controller
// admin create user endpoint
// batch user import
```

---

### Q14: How does the voting system prevent a user from voting twice? Discuss the implementation and potential race conditions.

**How to Approach:**
1. **Explain current mechanism** - isVoted flag check
2. **Walk through voting flow** - Check, update, save
3. **Identify race condition risk** - What if two requests simultaneously
4. **Discuss transaction need** - Atomic operations
5. **Suggest solutions** - Database transactions, distributed locks

**Answer Structure:**
```
Current Implementation:
1. Check user.isVoted === false
2. Update candidate.votes array
3. Update candidate.voteCount
4. Set user.isVoted = true

The Race Condition Problem:

Scenario: Two simultaneous vote requests
Timeline:
T1: Request A checks isVoted (false) ✓
T2: Request B checks isVoted (false) ✓
T3: Request A saves user.isVoted = true
T4: Request B saves user.isVoted = true

Result: Both votes counted!

Reason: No atomic check-and-set operation
```

**Solutions:**

1. **MongoDB Transactions (Recommended)**
```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations succeed or all fail
  const user = await User.findById(userId).session(session);
  
  if (user.isVoted) {
    throw new Error('Already voted');
  }
  
  const candidate = await Candidate.findById(candidateId).session(session);
  candidate.votes.push({ user: userId });
  candidate.voteCount += 1;
  
  user.isVoted = true;
  
  await user.save({ session });
  await candidate.save({ session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

2. **Atomic Update with findByIdAndUpdate**
```javascript
const user = await User.findByIdAndUpdate(
  userId,
  { $set: { isVoted: true } },
  { 
    new: true,
    // Only update if isVoted is currently false
    conditions: { isVoted: false }
  }
);

if (!user) {
  throw new Error('User already voted');
}
```

3. **Distributed Lock (Redis)**
```javascript
const lock = await redis.set(
  `vote:${userId}`,
  '1',
  'NX',  // Only set if not exists
  'EX',  // Expiration
  60
);

if (!lock) {
  throw new Error('Vote already in progress');
}

try {
  // Perform voting
} finally {
  await redis.del(`vote:${userId}`);
}
```

**Best Practice:**
- Use MongoDB transactions for ACID compliance
- Add unique index on (user, voting_session) for historical data
- Implement retry logic on client side

---

### Q15: Explain the routing structure. How would you add a new endpoint for admin to add candidates?

**How to Approach:**
1. **Explain current routing** - How routes are organized
2. **Show routing structure** - Modular routes with routers
3. **Walk through implementation** - Step by step for new endpoint
4. **Discuss middleware chain** - Where to add authentication
5. **Mention validation** - Input validation for new endpoint

**Answer Structure:**
```
Current Routing Structure:
app.js:
  ├─ /voteadhikar/auth → auth.route.js
  ├─ /voteadhikar/candidate → candidate.route.js
  └─ /voteadhikar/voting → voting.route.js

Benefits:
- Modular routing
- Easy to add new routes
- Single responsibility
- Reusable middleware

Implementation for "Add Candidate" Endpoint:

Step 1: Create/Update Controller
```

```javascript
// candidate.controller.js
export const addCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only admins can add candidates' 
      });
    }

    const { name, party, symbol } = req.body;

    // Check duplicate
    const existing = await Candidate.findOne({ name, party });
    if (existing) {
      return res.status(400).json({ 
        message: 'Candidate already exists' 
      });
    }

    const candidate = new Candidate({
      name,
      party,
      symbol,
      voteCount: 0
    });

    await candidate.save();

    return res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      candidate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

Step 2: Add Route

```javascript
// candidate.route.js
import { 
  addCandidate, 
  updateCandidate, 
  deleteCandidate 
} from '../controllers/candidate.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = Router();

// Middleware chain: authentication → validation → controller
router.post(
  '/add',
  protectRoute,  // Check authentication
  [                // Validation
    body('name').notEmpty().trim(),
    body('party').notEmpty().trim(),
    body('symbol').optional().trim()
  ],
  addCandidate   // Controller
);

router.put(
  '/update/:id',
  protectRoute,
  updateCandidate
);

router.delete(
  '/delete/:id',
  protectRoute,
  deleteCandidate
);

export default router;
```

Step 3: Call from Frontend

```javascript
// api.js
export const candidateAPI = {
  addCandidate: (data) => api.post('/candidate/add', data),
};

// In React component
const handleAddCandidate = async (candidateData) => {
  try {
    const res = await candidateAPI.addCandidate(candidateData);
    toast.success('Candidate added successfully');
  } catch (err) {
    toast.error(err.response?.data?.message);
  }
};
```

---

## Database (MongoDB, Mongoose)

### Q16: Explain the User schema design. What fields are required and why? How would you optimize it?

**How to Approach:**
1. **Explain current schema** - All fields and their types
2. **Discuss field constraints** - unique, required, enum
3. **Explain design decisions** - Why these fields
4. **Identify potential issues** - What could be improved
5. **Suggest optimizations** - Indexes, normalization

**Current Schema Analysis:**

```javascript
User Schema:
- name: String (required) → identification
- age: Number (required) → eligibility verification
- email: String (unique) → contact, password reset
- phone: String (unique, required) → contact, OTP verification
- address: String (required) → eligibility by region
- adharNumber: Number (unique, required) → primary ID proof
- password: String (required) → authentication
- role: enum [admin, voter] → authorization
- isVoted: Boolean (default false) → vote restriction
- timestamps → audit trail

Design Decisions:
1. adharNumber as unique identifier (India-specific use case)
2. isVoted flag prevents duplicate voting (simple but has race condition)
3. role-based access control for admin features
4. phone + email for multi-channel communication
```

**Issues & Optimizations:**

```javascript
// Optimized Schema
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name too short']
    },
    email: {
      type: String,
      unique: true,
      sparse: true,  // Allow null for unique constraint
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, 'Invalid phone number']
    },
    
    // Identification
    adharNumber: {
      type: String,  // Use String instead of Number for large numbers
      unique: true,
      required: true,
      match: [/^[0-9]{12}$/, 'Invalid Aadhaar']
    },
    
    // Address
    address: {
      street: String,
      city: String,
      state: String,
      zip: String
    },
    
    // Voting Info
    age: {
      type: Number,
      required: true,
      min: [18, 'Must be 18 to vote']
    },
    
    // Authentication
    password: {
      type: String,
      required: true,
      minlength: [8, 'Password too short']
      select: false  // Exclude by default in queries
    },
    
    // Authorization
    role: {
      type: String,
      enum: ['admin', 'voter'],
      default: 'voter'
    },
    
    // Voting Status
    isVoted: {
      type: Boolean,
      default: false,
      index: true  // For finding non-voters
    },
    votedAt: Date,  // When they voted
    votedForId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',  // Reference instead of nested data
      default: null
    },
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Metadata
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: Date
  },
  { 
    timestamps: true,
    // Don't store password by default
    toJSON: { select: '-password' }
  }
);

// Indexes
userSchema.index({ adharNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ isVoted: 1, role: 1 });  // Compound index
userSchema.index({ createdAt: -1 });  // For pagination
```

**Improvements Made:**

| Issue | Solution |
|-------|----------|
| Number overflow for Aadhaar | Use String type |
| Plain address string | Nested object for structure |
| Race condition on voting | Add votedAt, votedForId |
| No logout tracking | Add lastLogin, loginAttempts |
| Account suspension | Add isActive, lockedUntil |
| Slow queries | Strategic indexes |
| Password exposed in responses | Use select: false |

---

### Q17: What is the purpose of timestamps in MongoDB? How would you use them for auditing?

**How to Approach:**
1. **Explain timestamps** - createdAt and updatedAt
2. **Discuss use cases** - Audit trail, sorting, filtering
3. **Show implementation** - Enable in schema
4. **Mention timezone issues** - UTC handling
5. **Discuss audit logging** - Better approaches

**Answer Structure:**
```javascript
// Enable timestamps
const userSchema = new mongoose.Schema({
  // ... fields
}, { timestamps: true });

// Automatically added:
{
  createdAt: 2024-04-20T10:30:00.000Z,
  updatedAt: 2024-04-20T10:35:00.000Z
}

Use Cases:
1. Audit Trail
   - When was user created?
   - When did they last login?
   - When was account modified?

2. Sorting
   - List users by creation date
   - Get newest changes first

3. Filtering
   - Users created in last 24 hours
   - Modified after specific date

4. Analytics
   - Track user growth over time
   - Identify stale accounts
```

**Better Audit Logging:**
```javascript
// Audit Schema
const auditLogSchema = new mongoose.Schema({
  entityType: String,     // 'User', 'Candidate'
  entityId: mongoose.Schema.Types.ObjectId,
  action: String,         // 'CREATE', 'UPDATE', 'DELETE'
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  changes: {
    before: Object,
    after: Object
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Middleware to track changes
userSchema.post('save', async function(doc) {
  if (this.isNew) {
    await AuditLog.create({
      entityType: 'User',
      entityId: doc._id,
      action: 'CREATE',
      changes: { after: doc.toObject() },
      timestamp: new Date()
    });
  }
});
```

---

### Q18: How would you structure the Candidate schema to support multiple voting sessions?

**How to Approach:**
1. **Explain current limitation** - Single voting session only
2. **Design multi-session schema** - How to track votes per session
3. **Discuss query patterns** - How to fetch results
4. **Mention indexing** - For performance
5. **Show migration strategy** - From current to new

**Answer Structure:**
```
Current Structure Issue:
- All votes in single voteCount field
- No way to distinguish between elections/sessions
- Can't run multiple votes simultaneously

Solution: Session-based Design
```

```javascript
// Voting Session Schema
const votingSessionSchema = new mongoose.Schema({
  name: String,           // "2024 President Election"
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed'],
    default: 'upcoming'
  },
  isPublic: Boolean,      // Can publish results early?
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Updated Candidate Schema
const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  symbol: String,
  
  // Track votes per session
  sessions: [
    {
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VotingSession'
      },
      votes: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        timestamp: Date
      }],
      totalVotes: {
        type: Number,
        default: 0
      }
    }
  ]
}, { timestamps: true });

// Or better: Separate Vote Collection
const voteSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VotingSession',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes
voteSchema.index({ sessionId: 1, voterId: 1 }, { unique: true });
voteSchema.index({ sessionId: 1, candidateId: 1 });
voteSchema.index({ sessionId: 1, timestamp: 1 });

// Query Results
async function getSessionResults(sessionId) {
  return await Vote.aggregate([
    { $match: { sessionId } },
    { $group: {
      _id: '$candidateId',
      voteCount: { $sum: 1 }
    }},
    { $lookup: {
      from: 'candidates',
      localField: '_id',
      foreignField: '_id',
      as: 'candidate'
    }},
    { $sort: { voteCount: -1 }}
  ]);
}
```

**Recommended Approach:**
- Separate Vote collection is better than nested arrays
- Cleaner queries and aggregation
- Better performance with large vote counts
- Easier to handle vote corrections/recounts

---

## Authentication & Security

### Q19: Analyze the JWT token implementation. What are the security concerns and how would you address them?

**How to Approach:**
1. **Explain JWT basics** - Header, payload, signature
2. **Show current implementation** - Token generation and verification
3. **Identify vulnerabilities** - What could go wrong
4. **Discuss token lifecycle** - Expiration, refresh
5. **Suggest improvements** - Best practices

**Current Implementation:**
```javascript
// Generate token
const token = jwt.sign(
  { userId: newUser._id },
  process.env.JWT_SECRET,
  { expiresIn: "2h" }
);

// Store in cookie
res.cookie("jwt", token, {
  maxAge: 2 * 24 * 60 * 60 * 1000,  // 2 days
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Security Issues:**

| Issue | Risk | Solution |
|-------|------|----------|
| Token expiry mismatch | Token valid 2h but cookie valid 2d | Match expiresIn to maxAge |
| No refresh token | Can't extend session | Implement refresh token rotation |
| Single secret key | Compromise affects all tokens | Rotate secrets periodically |
| No token invalidation | Logout doesn't invalidate | Use blacklist/session store |
| Token stored in cookie | Vulnerable to CSRF | Implement CSRF tokens |
| No rate limiting | Brute force attacks possible | Add rate limiting middleware |

**Improved Implementation:**

```javascript
// Generate token pair
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }  // Short expiry
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Set cookies
const setTokenCookies = (res, tokens) => {
  res.cookie('accessToken', tokens.accessToken, {
    maxAge: 15 * 60 * 1000,      // 15 minutes
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/auth/refresh'  // Only send on refresh endpoint
  });
};

// Refresh token endpoint
export const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Check blacklist
    if (tokenBlacklist.has(refreshToken)) {
      return res.status(401).json({ message: 'Token revoked' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newTokens = generateTokens(decoded.userId);
    setTokenCookies(res, newTokens);

    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Token blacklist for logout
const tokenBlacklist = new Set();

export const logout = (req, res) => {
  const token = req.cookies.jwt;
  tokenBlacklist.add(token);  // In production: use Redis

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};

// Better: Use Redis for distributed systems
// redis.setex(token, expiresIn, 'blacklisted');
```

**Additional Security Measures:**

```javascript
// 1. Rate Limiting
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts
  message: 'Too many login attempts, try again later'
});

app.post('/auth/login', loginLimiter, login);

// 2. CSRF Protection
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

// 3. Helmet.js for security headers
import helmet from 'helmet';
app.use(helmet());

// 4. Account Lockout
userSchema.methods.lockAccount = async function(duration = 15) {
  this.lockedUntil = new Date(Date.now() + duration * 60 * 1000);
  await this.save();
};
```

---

### Q20: How would you implement password reset functionality securely?

**How to Approach:**
1. **Explain password reset flow** - Token generation, validation
2. **Discuss security requirements** - Short expiry, one-time use
3. **Show implementation** - Email sending, token storage
4. **Mention common mistakes** - What to avoid
5. **Discuss verification** - Email verification

**Answer Structure:**
```javascript
// Step 1: User requests password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists (security)
      return res.json({ 
        success: true, 
        message: 'If email exists, reset link sent' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Store in database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;  // 10 minutes
    await user.save();

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendResetEmail(user.email, resetUrl);

    res.json({ 
      success: true, 
      message: 'Password reset link sent' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 2: User clicks link and submits new password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash token for comparison
    const hashedToken = crypto.createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }  // Not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters' 
      });
    }

    // Update password
    user.password = newPassword;  // Will be hashed by pre('save') hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    
    // Invalidate all existing tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    
    await user.save();

    res.json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User Schema additions
userSchema.add({
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  tokenVersion: Number  // Invalidate all tokens on password change
});

// Check if token was issued before password change
userSchema.methods.isTokenIssuedBeforePasswordChange = function(tokenIssuedAt) {
  if (this.passwordChangedAt) {
    return tokenIssuedAt < this.passwordChangedAt.getTime() / 1000;
  }
  return false;
};
```

**Security Best Practices:**

```
1. Token Security
   ✓ Use crypto.randomBytes() for generation
   ✓ Hash token before storage
   ✓ Short expiration (10 minutes)
   ✓ One-time use (delete after use)

2. User Experience
   ✓ Don't reveal if email exists
   ✓ Clear error messages
   ✓ Confirm password change via email

3. Email Security
   ✓ Send link in email, not token
   ✓ Link should be HTTPS only
   ✓ Verify email after reset

4. Additional Measures
   ✓ Rate limit reset requests
   ✓ Log password changes
   ✓ Notify user of change
   ✓ Invalidate all sessions
   ✓ Option to undo within 24 hours
```

---

## API Design & Integration

### Q21: Analyze the API design in api.js. How would you structure it differently for a larger application?

**How to Approach:**
1. **Examine current API structure** - Simple object grouping
2. **Identify limitations** - Scaling issues
3. **Discuss improvements** - Service layer, better organization
4. **Show alternatives** - GraphQL, gRPC
5. **Mention versioning** - API v1, v2

**Current Structure:**
```javascript
// Flat object grouping
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.put('/auth/profile/password', data),
};
```

**Issues:**
- Limited error handling
- No request/response interceptors
- Hardcoded endpoints
- No retry logic
- No caching

**Improved Structure:**

```javascript
// apiClient.js - Base configuration
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      try {
        await refreshAccessToken();
        return apiClient.request(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// apiService.js - Centralized service
class ApiService {
  constructor(baseEndpoint, client = apiClient) {
    this.baseEndpoint = baseEndpoint;
    this.client = client;
  }

  async get(endpoint, config = {}) {
    return this.client.get(`${this.baseEndpoint}/${endpoint}`, config);
  }

  async post(endpoint, data, config = {}) {
    return this.client.post(`${this.baseEndpoint}/${endpoint}`, data, config);
  }

  async put(endpoint, data, config = {}) {
    return this.client.put(`${this.baseEndpoint}/${endpoint}`, data, config);
  }

  async delete(endpoint, config = {}) {
    return this.client.delete(`${this.baseEndpoint}/${endpoint}`, config);
  }

  async patch(endpoint, data, config = {}) {
    return this.client.patch(`${this.baseEndpoint}/${endpoint}`, data, config);
  }
}

// auth.service.js - Specific service
class AuthService extends ApiService {
  constructor(client = apiClient) {
    super('auth', client);
  }

  signup(data) {
    return this.post('signup', data);
  }

  login(data) {
    return this.post('login', data);
  }

  logout() {
    return this.post('logout');
  }

  getProfile() {
    return this.get('profile');
  }

  changePassword(data) {
    return this.put('profile/password', data);
  }

  refreshToken() {
    return this.post('refresh');
  }
}

// candidate.service.js
class CandidateService extends ApiService {
  constructor(client = apiClient) {
    super('candidates', client);
  }

  getAll() {
    return this.get('');
  }

  getById(id) {
    return this.get(id);
  }

  create(data) {
    return this.post('', data);
  }

  update(id, data) {
    return this.put(id, data);
  }

  delete(id) {
    return this.delete(id);
  }
}

// voting.service.js
class VotingService extends ApiService {
  constructor(client = apiClient) {
    super('voting', client);
  }

  getCandidates() {
    return this.get('candidates');
  }

  vote(candidateId) {
    return this.post(`${candidateId}`, {});
  }

  getResults() {
    return this.get('results');
  }
}

// index.js - Export all services
export const authService = new AuthService();
export const candidateService = new CandidateService();
export const votingService = new VotingService();

// Usage in React
import { authService } from './services';

const handleLogin = async (credentials) => {
  try {
    const response = await authService.login(credentials);
    setUser(response.data.user);
  } catch (error) {
    handleError(error);
  }
};
```

**Additional Improvements:**

```javascript
// 1. Error Handling
class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

// 2. Caching Strategy
const cache = new Map();

function withCache(fn, ttl = 5000) {
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = await fn(...args);
    cache.set(key, result);
    setTimeout(() => cache.delete(key), ttl);
    return result;
  };
}

// 3. Retry Logic
async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 4. Request Timeout
apiClient.defaults.timeout = 30000;  // 30 seconds
```

---

### Q22: How would you implement pagination for the voting results endpoint?

**How to Approach:**
1. **Explain pagination need** - Large datasets
2. **Show current implementation** - No pagination
3. **Discuss pagination approaches** - Offset, cursor-based
4. **Implement backend** - Query modification
5. **Implement frontend** - Display, navigation

**Backend Implementation:**

```javascript
// voting.controller.js - Paginated results
export const getVoteCountPaginated = async (req, res) => {
  try {
    // Get pagination params with defaults
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Get results
    const candidates = await Candidate.find()
      .select("name party voteCount")
      .sort({ voteCount: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count
    const totalCount = await Candidate.countDocuments();

    // Calculate metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      data: candidates,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
        startIndex: skip + 1,
        endIndex: Math.min(skip + limit, totalCount)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Better: Use aggregation pipeline for complex filtering
export const getVoteCountAggregated = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $facet: {
          // Get paginated results
          data: [
            { $sort: { voteCount: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { name: 1, party: 1, voteCount: 1 } }
          ],
          // Get total count
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const [result] = await Candidate.aggregate(pipeline);
    const totalCount = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

**Cursor-Based Pagination (Better for real-time data):**

```javascript
// For voting results that update in real-time
export const getVoteCountCursor = async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const pageLimit = Math.min(100, parseInt(limit));

    let query = {};
    if (cursor) {
      // Cursor is the previous last item's ID
      const lastCandidate = await Candidate.findById(cursor);
      if (lastCandidate) {
        query = { voteCount: { $lt: lastCandidate.voteCount } };
      }
    }

    const candidates = await Candidate.find(query)
      .select("name party voteCount")
      .sort({ voteCount: -1 })
      .limit(pageLimit + 1);

    const hasMore = candidates.length > pageLimit;
    const data = hasMore ? candidates.slice(0, -1) : candidates;
    const nextCursor = hasMore ? data[data.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      data,
      pageInfo: {
        hasMore,
        nextCursor,
        count: data.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

**Frontend Implementation:**

```javascript
// React component with pagination
const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const limit = 10;

  useEffect(() => {
    loadResults();
  }, [page]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await votingAPI.getVoteCountPaginated({
        page,
        limit
      });
      setResults(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <table>
        <tbody>
          {results.map((candidate) => (
            <tr key={candidate._id}>
              <td>{candidate.name}</td>
              <td>{candidate.party}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>

        <select
          value={limit}
          onChange={(e) => setPage(1)} // Reset to first page
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  );
};
```

---

## DevOps & Deployment

### Q23: Explain the Docker setup for this project. How would you improve it for production?

**How to Approach:**
1. **Examine Dockerfiles** - Current setup
2. **Discuss multi-stage builds** - Optimization
3. **Explain docker-compose** - Local development
4. **Mention production considerations** - Secrets, logging
5. **Discuss orchestration** - Kubernetes

**Current Dockerfile Analysis:**

```dockerfile
# Client/dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Issues:
# 1. Dependencies not cached separately
# 2. Build artifacts and dev dependencies included
# 3. No health checks
# 4. Runs as root
```

**Improved Dockerfile:**

```dockerfile
# Multi-stage build for Client
FROM node:18-alpine AS builder

WORKDIR /build
COPY package*.json ./
RUN npm ci --only=production && \
    npm install --save-dev

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /build/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Server Dockerfile improvements
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
```

**Docker Compose for Development:**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: voting_mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: voting_system
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test
      interval: 10s
      timeout: 5s
      retries: 5

  server:
    build:
      context: ./Server
      dockerfile: dockerfile
    container_name: voting_server
    ports:
      - "5000:3000"
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://mongodb:27017/voting_system
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: http://localhost:5173
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - ./Server:/app
      - /app/node_modules
    command: npm run dev

  client:
    build:
      context: ./Client
      dockerfile: dockerfile
    container_name: voting_client
    ports:
      - "80:80"
    depends_on:
      - server
    environment:
      VITE_API_URL: http://localhost:5000

volumes:
  mongodb_data:

networks:
  default:
    name: voting_network
```

**Production Deployment:**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: voting_mongodb_prod
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${DB_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}
      MONGO_INITDB_DATABASE: voting_system
    volumes:
      - mongodb_prod_data:/data/db
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    healthcheck:
      test: echo 'db.adminCommand("ping").ok' | mongosh -u $DB_USER -p $DB_PASSWORD localhost:27017/admin
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - voting_network

  server:
    build:
      context: ./Server
      dockerfile: dockerfile
    container_name: voting_server_prod
    restart: always
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://${DB_USER}:${DB_PASSWORD}@mongodb:27017/voting_system
      JWT_SECRET: ${JWT_SECRET}
      ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    depends_on:
      mongodb:
        condition: service_healthy
    healthcheck:
      test: curl -f http://localhost:3000/health || exit 1
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - voting_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  client:
    build:
      context: ./Client
      dockerfile: dockerfile
    container_name: voting_client_prod
    restart: always
    networks:
      - voting_network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    container_name: voting_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - server
      - client
    networks:
      - voting_network

volumes:
  mongodb_prod_data:

networks:
  voting_network:
    driver: bridge
```

**Production Nginx Configuration:**

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    upstream server {
        server server:3000;
    }

    upstream client {
        server client:80;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # Main HTTPS server
    server {
        listen 443 ssl http2;
        server_name example.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # API routes
        location /api/ {
            limit_req zone=api_limit burst=20;
            proxy_pass http://server;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login rate limiting
        location /api/auth/login {
            limit_req zone=login_limit burst=2;
            proxy_pass http://server;
        }

        # Static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://client;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Client
        location / {
            proxy_pass http://client;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

---

### Q24: How would you set up CI/CD pipeline using GitHub Actions?

**How to Approach:**
1. **Explain CI/CD benefits** - Automation, consistency
2. **Design pipeline** - Build, test, deploy stages
3. **Show GitHub Actions workflow** - Syntax, structure
4. **Discuss testing** - Unit, integration tests
5. **Mention security** - Secrets, permissions

**GitHub Actions Workflow:**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Build and test server
  server-build:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: Server/package-lock.json

      - name: Install dependencies
        working-directory: ./Server
        run: npm ci

      - name: Run linter
        working-directory: ./Server
        run: npm run lint --if-present

      - name: Run tests
        working-directory: ./Server
        env:
          MONGODB_URI: mongodb://localhost:27017/voting_test
          JWT_SECRET: test_secret
        run: npm test --if-present

      - name: Build
        working-directory: ./Server
        run: npm run build --if-present

  # Build and test client
  client-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: Client/package-lock.json

      - name: Install dependencies
        working-directory: ./Client
        run: npm ci

      - name: Run linter
        working-directory: ./Client
        run: npm run lint

      - name: Build
        working-directory: ./Client
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: ./Client/lighthouse-config.json

  # Security scanning
  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          path: '.'
          format: 'JSON'
          args: >-
            -l
            --enable-experimental

  # Build Docker images
  docker-build:
    needs: [server-build, client-build, security]
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push Server image
        uses: docker/build-push-action@v4
        with:
          context: ./Server
          file: ./Server/dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-server:${{ github.sha }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Client image
        uses: docker/build-push-action@v4
        with:
          context: ./Client
          file: ./Client/dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-client:${{ github.sha }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to staging
  deploy-staging:
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Deploy to Staging
        env:
          DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.STAGING_HOST }}
          DEPLOY_USER: ${{ secrets.STAGING_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST \
            'cd /app && docker-compose -f docker-compose.staging.yml pull && docker-compose -f docker-compose.staging.yml up -d'

  # Deploy to production
  deploy-production:
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Production
        env:
          DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.PROD_HOST }}
          DEPLOY_USER: ${{ secrets.PROD_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST \
            'cd /app && docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d'

      - name: Health Check
        run: |
          curl -f https://example.com/health || exit 1

      - name: Rollback on failure
        if: failure()
        env:
          DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.PROD_HOST }}
          DEPLOY_USER: ${{ secrets.PROD_USER }}
        run: |
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST \
            'cd /app && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d --no-build'
```

---

## Best Practices & Code Quality

### Q25: What are the best practices you would implement to improve code quality in this project?

**How to Approach:**
1. **Discuss linting and formatting** - ESLint, Prettier
2. **Explain testing strategy** - Unit, integration, e2e tests
3. **Mention error handling** - Global error handlers
4. **Discuss logging** - Structured logging
5. **Code review practices** - PR templates, guidelines

**Answer Structure:**

**1. Linting & Formatting**

```javascript
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:node/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-console": "warn",
    "no-var": "error",
    "prefer-const": "error",
    "no-unused-vars": "error",
    "eqeqeq": "error",
    "curly": "error",
    "brace-style": ["error", "1tbs"]
  }
}

// .prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}

// package.json scripts
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write ."
}
```

**2. Testing Strategy**

```javascript
// Server tests using Jest and Supertest
// __tests__/auth.controller.test.js
import request from 'supertest';
import app from '../app';
import User from '../src/models/user.model';
import * as authService from '../src/services/auth.service';

jest.mock('../src/services/auth.service');
jest.mock('../src/models/user.model');

describe('Auth Controller', () => {
  describe('POST /signup', () => {
    it('should create new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        adharNumber: '123456789012',
        address: '123 Main St',
        age: 25,
        phone: '9876543210'
      };

      authService.createUser.mockResolvedValue({
        _id: '1',
        ...userData,
        password: 'hashed'
      });

      const response = await request(app)
        .post('/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.name).toBe(userData.name);
    });

    it('should reject weak passwords', async () => {
      const userData = {
        name: 'John Doe',
        password: 'weak',
        // ... other fields
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('at least 8 characters');
    });
  });
});

// Frontend tests using Vitest
// src/__tests__/AuthContext.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { vi } from 'vitest';

vi.mock('../api/api', () => ({
  authAPI: {
    getProfile: vi.fn()
  }
}));

describe('AuthContext', () => {
  it('should provide auth state', async () => {
    const TestComponent = () => {
      const { user, loading } = useAuth();
      return (
        <div>
          {loading && <div>Loading...</div>}
          {user && <div>{user.name}</div>}
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
```

**3. Error Handling**

```javascript
// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error
  logger.error({
    status,
    message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body
    }
  });

  // Send response
  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage in controller
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ adharNumber: req.body.adharNumber });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
  } catch (error) {
    next(error);
  }
};
```

**4. Structured Logging**

```javascript
// logger.js using Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'voting-system' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Usage
logger.info('User logged in', { userId: user._id });
logger.error('Database connection failed', { error: err.message });
```

---

This comprehensive guide covers 25 major technical questions that could be asked about your Voting System project. Each question includes:

✅ **How to Approach** - Strategy for answering  
✅ **Detailed Explanation** - Deep understanding required  
✅ **Code Examples** - Practical implementation  
✅ **Best Practices** - Industry standards  
✅ **Common Pitfalls** - What to avoid  

**Pro Tips for Interviews:**
1. Start with basics, then go deep if asked
2. Always relate answers back to the project
3. Show awareness of trade-offs and alternatives
4. Ask clarifying questions if needed
5. Mention testing and error handling
6. Discuss scalability and performance
7. Show knowledge of security best practices
