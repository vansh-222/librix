# How to Use Librarian Layout Components

I've created reusable components for the librarian pages to reduce code duplication:

## Components Created:

1. **LibrarianSidebar** - The left sidebar with navigation
2. **LibrarianNavbar** - The top navbar with search and user menu
3. **LibrarianLayout** - Combines both sidebar and navbar

## Files Location:
- `src/components/librarian/LibrarianSidebar.js`
- `src/components/librarian/LibrarianNavbar.js`
- `src/components/librarian/LibrarianLayout.js`

## How to Use:

### Option 1: Use LibrarianLayout (Recommended - All-in-one)

```jsx
'use client';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';

export default function YourPage() {
  return (
    <LibrarianLayout 
      title="Dashboard" 
      subtitle="Welcome back, Anita Sharma!"
      searchPlaceholder="Search books, members, ISBN..."
    >
      {/* Your page content here */}
      <div style={{ padding: 28 }}>
        <h1>Your Content</h1>
      </div>
    </LibrarianLayout>
  );
}
```

### Option 2: Use Individual Components

```jsx
'use client';
import LibrarianSidebar from '@/components/librarian/LibrarianSidebar';
import LibrarianNavbar from '@/components/librarian/LibrarianNavbar';

export default function YourPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LibrarianSidebar />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <LibrarianNavbar 
          title="Your Page" 
          subtitle="Subtitle here"
          searchPlaceholder="Search..."
        />
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {/* Your content */}
        </div>
      </div>
    </div>
  );
}
```

## Props:

### LibrarianLayout / LibrarianNavbar Props:
- `title` (required): Page title (e.g., "Dashboard", "Members")
- `subtitle` (required): Subtitle text (e.g., "Welcome back, Anita Sharma!")
- `searchPlaceholder` (optional): Search box placeholder (default: "Search books, members, ISBN...")

## Benefits:
- ✅ Consistent design across all pages
- ✅ Reduced code duplication
- ✅ Easy to maintain and update
- ✅ Navbar dropdown with logout already included
- ✅ Sidebar navigation with active state detection

## Example for Dashboard:
See the updated structure - just replace the entire sidebar and navbar code with:

```jsx
<LibrarianLayout 
  title="Dashboard" 
  subtitle="Welcome back, Anita Sharma!"
>
  {/* Your dashboard content */}
</LibrarianLayout>
```

## Example for Members Page:
```jsx
<LibrarianLayout 
  title="Members" 
  subtitle="Manage and view all library members"
  searchPlaceholder="Search members by name, email, phone..."
>
  {/* Your members page content */}
</LibrarianLayout>
```

This way, your page files will be much shorter and focused only on the page-specific content!
