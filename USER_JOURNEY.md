# HireSight - User Journey & Technical Architecture

## Overview
HireSight is a career exploration and job market intelligence platform that helps users discover career fields, get AI-powered insights, and scrape job listings from popular job websites.

---

## Application Architecture

### Client-Side (React Frontend)
**Technology Stack:** React 18, TypeScript, Vite, TailwindCSS, React Router, Tanstack Query

#### Components & Pages

1. **Navigation System**
   - `Navigation.tsx`: Main navigation bar with links to all pages
   - `NavLink.tsx`: Reusable navigation link component with active state

2. **Home Page** (`pages/Home.tsx`)
   - Landing page with hero section
   - Overview of features
   - Call-to-action buttons

3. **Career Fields Pages**
   - `pages/Fields.tsx`: Browse all career fields in a grid layout
   - `FieldCard.tsx`: Individual career field card component
   - `pages/FieldDetail.tsx`: Detailed view of a specific career field
     - **Tabs Interface:**
       - "Curated Data" tab: Static career information from `careerFields.ts`
       - "AI Insights" tab: Real-time AI-generated market insights

4. **AI Insights Feature** (`components/AIInsights.tsx`)
   - **Client-Side Logic:**
     - Manages UI state (loading, error, success)
     - Calls Supabase Edge Function `analyze-career`
     - Displays structured insights in card format
     - Handles user interactions (Generate/Refresh buttons)
   - **Data Display:**
     - Growth outlook with trend indicators
     - Salary ranges (min/avg/max in INR)
     - Trending job roles with counts
     - Technical skills with importance badges
     - Soft skills with importance badges
     - Top hiring locations

5. **Job Scraper** (`pages/Scraper.tsx`, `components/JobScraper.tsx`)
   - **Client-Side:**
     - URL input form with predefined quick links
     - Loading state management
     - Display scraped job results in cards
   - **User Flow:**
     1. Enter job website URL or click quick link
     2. Submit for scraping
     3. View extracted job listings with details

6. **Bookmarks & Compare**
   - `pages/Bookmarks.tsx`: View saved career fields
   - `pages/Compare.tsx`: Side-by-side comparison of career fields
   - `hooks/useBookmarks.ts`: localStorage-based bookmark management

7. **UI Components** (`components/ui/`)
   - Shadcn/ui component library (buttons, cards, tabs, etc.)
   - Toast notifications for user feedback
   - Design system with semantic color tokens

---

### Server-Side (Supabase Backend)
**Technology Stack:** Supabase (PostgreSQL + Edge Functions), Deno Runtime, Gemini AI API

#### Database Tables

1. **profiles**
   - Stores user profile information
   - Columns: id, full_name, email, avatar_url, created_at, updated_at
   - RLS: Users can view all profiles, update own profile

2. **scraped_jobs**
   - Stores AI-scraped job listings
   - Columns: id, user_id, title, company, location, salary, experience, skills, description, source_url, scraped_at
   - RLS: Users can only access their own scraped jobs

3. **saved_jobs**
   - Stores user-saved job listings
   - Columns: id, user_id, job_id, notes, created_at
   - RLS: Users can only access their own saved jobs

4. **user_roles**
   - Stores user role assignments (admin, moderator, user)
   - Uses enum type `app_role`
   - RLS: Users can view own roles, only admins can manage roles

#### Supabase Edge Functions

1. **analyze-career** (`supabase/functions/analyze-career/index.ts`)
   - **Purpose:** Generate real-time job market insights using Google Gemini AI
   - **Input:** 
     ```json
     {
       "careerField": "Software Engineering",
       "location": "India"
     }
     ```
   - **Process:**
     1. Receives request from client with career field name and location
     2. Retrieves `GEMINI_API_KEY` from Supabase secrets
     3. Constructs detailed prompt for Gemini 2.0 Flash model
     4. Enables Google Search tool for real-time web data
     5. Requests structured JSON output with specific schema
     6. Parses and validates AI response
   - **Output:**
     ```json
     {
       "insights": {
         "growthOutlook": { "trend": "Growing", "description": "..." },
         "salaryRanges": { "min": 300000, "avg": 800000, "max": 2000000, "currency": "INR" },
         "jobRoles": [{ "title": "Frontend Developer", "count": 1500 }],
         "technicalSkills": [{ "skill": "React", "importance": "High" }],
         "softSkills": [{ "skill": "Communication", "importance": "High" }],
         "topLocations": ["Bangalore", "Pune", "Hyderabad"],
         "marketDemand": "High demand with strong growth..."
       }
     }
     ```
   - **Error Handling:**
     - Rate limit detection (429)
     - API key validation
     - Gemini API error handling
     - CORS support for browser requests

2. **scrape-jobs** (`supabase/functions/scrape-jobs/index.ts`)
   - **Purpose:** Extract job listings from career websites using AI
   - **Input:**
     ```json
     {
       "url": "https://www.naukri.com/software-engineer-jobs"
     }
     ```
   - **Process:**
     1. Receives job website URL from client
     2. Uses `GEMINI_API_KEY` for AI-powered content extraction
     3. Fetches website content
     4. Analyzes page structure to identify job listings
     5. Extracts: title, company, location, salary, experience, skills, description
   - **Output:**
     ```json
     {
       "jobs": [
         {
           "title": "Senior Software Engineer",
           "company": "Tech Corp",
           "location": "Bangalore",
           "salary": "15-25 LPA",
           "experience": "5-8 years",
           "skills": ["Java", "Spring Boot", "Microservices"],
           "description": "...",
           "rawData": {}
         }
       ]
     }
     ```
   - **Error Handling:**
     - Invalid URL detection
     - Website access failures
     - Content parsing errors
     - CORS support

#### Database Functions

1. **has_role(_user_id uuid, _role app_role)**
   - Security definer function to check user roles
   - Prevents recursive RLS policy issues
   - Used in admin authorization checks

2. **handle_new_user()**
   - Trigger function on auth.users INSERT
   - Automatically creates profile entry
   - Assigns default 'user' role

3. **handle_updated_at()**
   - Trigger function for timestamp management
   - Updates `updated_at` column automatically

---

## User Journey Flows

### Flow 1: Exploring Career Fields with AI Insights

**Client-Side:**
1. User navigates to `/fields` page
2. Browses career field cards (data from `careerFields.ts`)
3. Clicks on a career field card
4. Routed to `/field/:fieldId` (FieldDetail page)
5. Sees two tabs: "Curated Data" and "AI Insights"
6. Clicks "AI Insights" tab
7. Clicks "Generate AI Insights" button
8. Loading state shown: "Analyzing job market data with AI..."

**Server-Side:**
9. `supabase.functions.invoke('analyze-career')` called
10. Edge function retrieves `GEMINI_API_KEY` from secrets
11. Constructs prompt with career field and location
12. Calls Gemini 2.0 Flash API with Google Search enabled
13. AI searches the web for current job market data
14. AI generates structured JSON response
15. Edge function validates and returns insights

**Client-Side:**
16. Receives insights data
17. Displays in structured cards:
    - Growth outlook with trend badge
    - Salary ranges (₹ formatted)
    - Job roles with counts
    - Skills with color-coded importance
    - Top locations as tags
18. User can click "Refresh" to regenerate insights

### Flow 2: Scraping Job Listings

**Client-Side:**
1. User navigates to `/scraper` page
2. Enters job website URL or clicks quick link (Naukri, LinkedIn, etc.)
3. Clicks "Scrape Jobs" button
4. Loading state shown with spinner

**Server-Side:**
5. `supabase.functions.invoke('scrape-jobs')` called with URL
6. Edge function retrieves `GEMINI_API_KEY`
7. Fetches website content
8. Uses Gemini AI to analyze page structure
9. Extracts job listing data (title, company, salary, skills, etc.)
10. Returns array of job objects

**Client-Side:**
11. Receives scraped jobs data
12. Displays jobs in card format with all details
13. User can view job details, copy information, or navigate to original listing

### Flow 3: Bookmarking Career Fields

**Client-Side Only:**
1. User views career field details
2. Clicks bookmark/save button
3. `useBookmarks` hook saves field ID to localStorage
4. Toast notification confirms save
5. Field appears in `/bookmarks` page
6. User can remove bookmarks (updates localStorage)

**Note:** This is purely client-side with no server persistence (yet)

### Flow 4: Comparing Career Fields

**Client-Side Only:**
1. User selects multiple career fields for comparison
2. Navigates to `/compare` page
3. Side-by-side view of selected fields
4. Compares: salary, growth, skills, education requirements
5. All data from static `careerFields.ts` file

**Note:** Could be enhanced with AI-powered real-time comparison

---

## Data Flow Summary

### Static Data (Client-Side)
- Career fields catalog (`src/data/careerFields.ts`)
- Bookmarks (localStorage)
- UI state management (React hooks)
- Routing and navigation

### Dynamic Data (Server-Side)
- AI-generated career insights (Gemini API)
- Job scraping results (Gemini API)
- User profiles (Supabase database)
- Saved jobs (Supabase database)
- User roles and permissions (Supabase database)

### API Communication
- Client uses `@supabase/supabase-js` client
- Edge functions invoked via `supabase.functions.invoke()`
- CORS enabled for browser requests
- Authentication tokens passed automatically
- Row-Level Security enforces data access

---

## Security Model

### Client-Side Security
- No sensitive credentials stored in browser
- API keys managed server-side only
- Authentication state managed by Supabase Auth
- RLS policies enforced by server

### Server-Side Security
- `GEMINI_API_KEY` stored in Supabase secrets
- Edge functions run in isolated Deno environment
- Database queries filtered by RLS policies
- Role-based access control (RBAC) with security definer functions
- CORS headers configured for legitimate requests only

### Row-Level Security (RLS)
- **profiles:** Users can view all, update own
- **scraped_jobs:** Users can only access their own data
- **saved_jobs:** Users can only access their own data
- **user_roles:** Users view own roles, admins manage all roles

---

## Environment Configuration

### Client Environment Variables (`.env`)
```env
VITE_SUPABASE_URL=https://oncnphlltabyplwgbvlt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Server Environment Variables (Supabase Secrets)
```
GEMINI_API_KEY=<Google AI API Key>
SUPABASE_URL=<Auto-provided>
SUPABASE_ANON_KEY=<Auto-provided>
SUPABASE_SERVICE_ROLE_KEY=<Auto-provided>
```

---

## Technology Decisions

### Why Client-Side Rendering (React)?
- Fast, interactive UI
- Rich component ecosystem (Shadcn/ui)
- Easy state management
- Great developer experience

### Why Supabase Edge Functions?
- Secure API key management
- Serverless scaling
- Integrated with Supabase Auth and Database
- Deno runtime (TypeScript native)

### Why Google Gemini API?
- Google Search tool for real-time data
- Structured JSON output mode
- Fast response times (2.0 Flash model)
- Generous free tier (60 requests/minute)
- Superior accuracy for market data analysis

### Why PostgreSQL (Supabase)?
- Row-Level Security for data isolation
- Built-in authentication integration
- Real-time subscriptions (future feature)
- Powerful querying capabilities
- Excellent TypeScript support

---

## Future Enhancements

### Potential Client-Side Additions
- Advanced filtering and search
- Personalized career recommendations
- Interactive charts and visualizations
- Career path roadmaps
- Skill gap analysis

### Potential Server-Side Additions
- Job alert notifications
- Scheduled job scraping
- Career insights caching
- User activity analytics
- AI-powered resume matching
- Salary negotiation insights

### Potential Full-Stack Features
- User authentication (Supabase Auth)
- Save AI insights to database
- Share insights with others
- Export insights as PDF
- Community forums
- Mentor matching system

---

## Performance Considerations

### Client-Side Optimization
- Code splitting with React lazy loading
- Image optimization
- TailwindCSS purging unused styles
- React Query caching for API calls
- Debouncing search inputs

### Server-Side Optimization
- Edge function cold start < 100ms
- Gemini API response caching (future)
- Database query optimization with indexes
- Connection pooling
- Rate limiting to prevent abuse

---

## Monitoring & Debugging

### Client-Side Debugging
- React DevTools for component inspection
- Network tab for API call monitoring
- Console logs for state changes
- Error boundaries for crash handling

### Server-Side Debugging
- Supabase Edge Function logs dashboard
- Database query performance monitoring
- Gemini API usage tracking
- Error rate monitoring
- Rate limit tracking

---

## Conclusion

HireSight demonstrates a modern, scalable architecture that separates concerns effectively:

- **Client handles:** User interface, routing, state management, user interactions
- **Server handles:** AI processing, external API calls, data persistence, authentication, security

This separation ensures:
- ✅ Security: API keys never exposed to client
- ✅ Scalability: Serverless functions scale automatically
- ✅ Maintainability: Clear boundaries between concerns
- ✅ Performance: Client-side rendering for speed, server-side for heavy tasks
- ✅ User Experience: Smooth, responsive interface with powerful backend capabilities
