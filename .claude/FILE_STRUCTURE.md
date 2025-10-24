# File Structure & Design Principles

This document outlines the file organization standards and design principles for the AI CSR web application.

## Design Principles

### 1. No Prop Drilling
Components should be self-contained and fetch their own data rather than receiving it through props. Use `useParams()` to access route parameters like `companySlug` directly in each component.

```typescript
// ✅ Good: Self-contained component
function StatsCards() {
  const params = useParams();
  const companySlug = params.companySlug as string;

  const company = useQuery(api.companies.queries.getCompanyBySlug, { slug: companySlug });
  const stats = useQuery(api.conversations.getStats, { companyId: company?._id });
  // ...
}

// ❌ Avoid: Prop drilling
function StatsCards({ companyId }: { companyId: string }) {
  const stats = useQuery(api.conversations.getStats, { companyId });
  // ...
}
```

### 2. Component Locality
Keep components close to where they're used until proven reusable. Only move to shared locations when actually used in multiple places.

- **Start local**: Build components in `page/components/`
- **Identify reuse**: When used in 2+ places, consider moving to shared location
- **Migrate gradually**: Refactor to shared components only when necessary

### 3. Self-Contained Data Fetching
Each component is responsible for fetching its own data using Convex queries. This leverages Convex's automatic caching and real-time subscriptions.

```typescript
function ConversationTable() {
  const params = useParams();
  const companySlug = params.companySlug as string;

  const company = useQuery(api.companies.queries.getCompanyBySlug, { slug: companySlug });
  const conversations = useQuery(api.conversations.getConversations, {
    companyId: company?._id
  });

  // Use skeleton loading that matches final UI structure
  if (!company || !conversations) return <ConversationTableSkeleton />;

  // Component handles its own loading states, errors, and data
}
```

### 4. Skeleton Loading States
Use skeleton loaders that mirror the final UI structure instead of generic spinners or null states.

```typescript
// ✅ Good: Skeleton loader that matches final layout
function ConversationTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ❌ Avoid: Generic spinner or null state
function ConversationTable() {
  const data = useQuery(api.conversations.getConversations);

  if (!data) return <LoadingSpinner />; // Creates layout shift
  if (!data) return null; // Creates layout shift
}
```

**Benefits of Skeleton Loading:**
- **No Layout Shifts**: Maintains consistent page structure during loading
- **Better UX**: Users see the shape of incoming content
- **Performance Perception**: Feels faster than generic spinners
- **Accessibility**: Screen readers understand the content structure

## File Structure

### Directory Organization

```
components/                    # Root-level shared components
├── ui/                        # shadcn/ui generated components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── table.tsx
├── pieces/                    # Truly reusable custom components
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── DataTable.tsx          # Only if used across multiple pages
└── layout/                    # Layout-specific components
    ├── NavBar.tsx
    ├── CompanySelector.tsx
    └── UserMenu.tsx

app/
├── [companySlug]/             # Dynamic company routes
│   ├── layout.tsx             # Company-specific layout
│   ├── page.tsx               # Redirects to /dashboard
│   ├── dashboard/
│   │   ├── page.tsx           # Imports DashboardPage component
│   │   └── components/        # Dashboard-specific components
│   │       ├── DashboardPage.tsx
│   │       ├── StatsCards.tsx
│   │       ├── ConversationTable.tsx
│   │       └── ConversationPanel.tsx
│   ├── agents/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── AgentsPage.tsx
│   │       ├── AgentCard.tsx
│   │       └── TrafficSlider.tsx
│   ├── company/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── CompanyPage.tsx
│   │       ├── BusinessInfoTab.tsx
│   │       ├── HoursTab.tsx
│   │       └── FeesTab.tsx
│   └── team/
│       ├── page.tsx
│       └── components/
│           ├── TeamPage.tsx
│           ├── UserTable.tsx
│           └── InviteModal.tsx
└── globals.css                # Global styles
```

### Component Categories

#### 1. Page Components (`page.tsx`)
Minimal files that import and render the main page component:

```typescript
// app/[companySlug]/dashboard/page.tsx
import DashboardPage from "./components/DashboardPage";

export default function Page() {
  return <DashboardPage />;
}
```

#### 2. Page-Specific Components (`[page]/components/`)
Components used only within a specific page. These handle the main structure and logic for that page.

```typescript
// app/[companySlug]/dashboard/components/DashboardPage.tsx
export default function DashboardPage() {
  return (
    <div className="dashboard-layout">
      <StatsCards />
      <ConversationTable />
    </div>
  );
}
```

#### 3. Shared Components (`components/`)

**UI Components (`components/ui/`)**
- Generated by shadcn/ui
- Basic building blocks (buttons, tables, modals)
- Follow shadcn naming conventions

**Reusable Pieces (`components/pieces/`)**
- Custom components used across multiple pages
- Only moved here when actually reused
- Examples: LoadingSpinner, ErrorBoundary, custom DataTable

**Layout Components (`components/layout/`)**
- Components specific to application layout
- Used across all pages (NavBar, UserMenu, etc.)

## Technology Stack

- **Framework**: Next.js App Router with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Tailwind + Radix primitives)
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk
- **State Management**: Convex React hooks (useQuery, useMutation)

### Import Aliases
Configured in `tsconfig.json` for cleaner imports:
- `@/*` → Root-level files (components, app, etc.)
- `@convex/*` → Convex directory (API, schema, etc.)

```typescript
// Clean imports using aliases
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## Routing Strategy

### URL Structure
```
/[companySlug]/dashboard          # Main dashboard
/[companySlug]/conversations      # Conversation management
/[companySlug]/agents            # Agent configuration
/[companySlug]/company           # Company settings
/[companySlug]/team             # Team management
```

### Data Flow
1. **Company Resolution**: Layout fetches company data by slug from URL
2. **Route Protection**: Middleware validates user access to company
3. **Component Data**: Each component fetches its own data using company ID
4. **Real-time Updates**: Convex subscriptions provide live data updates

## Development Workflow

### Adding New Components

1. **Start Local**: Create components in the page's `components/` directory
2. **Build Feature**: Implement functionality with self-contained data fetching
3. **Test Reusability**: Only move to `pieces/` when used in multiple places
4. **Follow Conventions**: Use TypeScript, Tailwind classes, and Convex hooks

### Example Component Structure

```typescript
// Import with clean aliases
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";

// Self-contained component with data fetching
export default function ExampleComponent() {
  // Get route params
  const params = useParams();
  const companySlug = params.companySlug as string;

  // Fetch company data
  const company = useQuery(api.companies.queries.getCompanyBySlug, {
    slug: companySlug
  });

  // Fetch component-specific data
  const data = useQuery(api.example.getData, {
    companyId: company?._id
  });

  // Handle loading with skeleton that matches final layout
  if (!company || !data) return <ExampleComponentSkeleton />;

  return (
    <Card>
      <CardContent>
        {/* Component JSX */}
      </CardContent>
    </Card>
  );
}
```

This approach ensures clean, maintainable code with minimal coupling between components.