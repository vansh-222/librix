# Student Profile Page - Visual Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Librarium                                    [Search] [Notifications]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📊 My Profile                                                        │
│  Manage your account and preferences                                 │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ✅ Profile updated successfully!                                     │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ┌────┐                                                        │  │
│  │  │ VP │  Vansh Patel                          [Student Badge] │  │
│  │  │    │  📧 student@apexcollege.edu                           │  │
│  │  └────┘                                                        │  │
│  │                                                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │ Student ID  │  │ Roll Number │  │ Department  │          │  │
│  │  │ STU2024001  │  │   CS-101    │  │ Comp. Sci.  │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  │                                                                │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │  │
│  │  │   Phone     │  │ Last Login  │  │ Member Since│          │  │
│  │  │ +91 98765.. │  │  16 Jun 26  │  │  01 Jan 26  │          │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
├───────────────────────────────────┬───────────────────────────────┤
│                                   │                               │
│  ┌─────────────────────────────┐ │ ┌─────────────────────────────┐│
│  │  📚                         │ │ │  ⏰                         ││
│  │  Currently Borrowed         │ │ │  Pending Requests          ││
│  │                             │ │ │                            ││
│  │      3                      │ │ │      2                     ││
│  │                             │ │ │                            ││
│  │  Books in your possession   │ │ │  Awaiting approval         ││
│  └─────────────────────────────┘ │ └─────────────────────────────┘│
│                                   │                               │
├───────────────────────────────────┼───────────────────────────────┤
│                                   │                               │
│  ┌─────────────────────────────┐ │ ┌─────────────────────────────┐│
│  │  🚨                         │ │ │  📅                         ││
│  │  Pending Fine               │ │ │  Due Soon (3 days)         ││
│  │                             │ │ │                            ││
│  │      ₹25                    │ │ │      1                     ││
│  │                             │ │ │                            ││
│  │  Pay at library counter     │ │ │  Books to return soon      ││
│  └─────────────────────────────┘ │ └─────────────────────────────┘│
│                                   │                               │
└───────────────────────────────────┴───────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ✏️ Edit Profile                                                      │
│  Update your personal information                                    │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                       │
│  ┌────────────────────────────┐  ┌────────────────────────────┐    │
│  │ 👤 Student ID              │  │ # Roll Number             │    │
│  │ [STU2024001____________]   │  │ [CS-101_______________]    │    │
│  └────────────────────────────┘  └────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────┐  ┌────────────────────────────┐    │
│  │ 🎓 Department              │  │ 📞 Phone Number            │    │
│  │ [Computer Science______]   │  │ [+91 98765 43210______]    │    │
│  └────────────────────────────┘  └────────────────────────────┘    │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🛡️ Your name and email can only be changed by your librarian │   │
│  │   for security reasons.                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  [💾 Save Changes]  [🔑 Change Password]                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  Account Actions                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                       │
│  [🚪 Sign Out]                                                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Password Change Modal (When Clicked)

```
                    ┌────────────────────────────┐
                    │                        [X] │
                    │  🔑 Change Password        │
                    │  ────────────────────────  │
                    │                            │
                    │  Current Password          │
                    │  [••••••••••••••••••]      │
                    │                            │
                    │  New Password              │
                    │  [••••••••••••••••••]      │
                    │  (min 6 characters)        │
                    │                            │
                    │  Confirm New Password      │
                    │  [••••••••••••••••••]      │
                    │                            │
                    │                            │
                    │  [Cancel] [💾 Change]      │
                    │                            │
                    └────────────────────────────┘
```

---

## Color Scheme

### Profile Header
- **Avatar**: Gradient from Indigo (#6366F1) to Purple (#8B5CF6)
- **Role Badge**: Light indigo background with indigo text
- **Info Cards**: Light gray background (--surface-2)

### Activity Stats
1. **Currently Borrowed** (Blue)
   - Icon background: `rgba(99,102,241,0.1)`
   - Number: `#6366F1`

2. **Pending Requests** (Orange)
   - Icon background: `rgba(245,158,11,0.1)`
   - Number: `#F59E0B`

3. **Pending Fine** (Red)
   - Icon background: `rgba(239,68,68,0.1)`
   - Number: `#EF4444`

4. **Due Soon** (Green)
   - Icon background: `rgba(34,197,94,0.1)`
   - Number: `#22C55E`

### Buttons
- **Primary (Save)**: Indigo gradient with white text
- **Secondary (Change Password)**: Gray with subtle hover
- **Danger (Sign Out)**: Red with white text

### Feedback Messages
- **Success**: Green background (`rgba(34,197,94,0.1)`) with green text
- **Error**: Red background (`rgba(239,68,68,0.1)`) with red text

---

## Responsive Behavior

### Desktop (> 768px)
- Two-column grid for stats (2x2)
- Side-by-side form fields
- Maximum width: 900px

### Tablet (768px - 1024px)
- Stats remain in 2x2 grid
- Form fields side-by-side
- Slightly reduced spacing

### Mobile (< 768px)
- Single column layout
- Stats stack vertically (1 per row)
- Form fields stack vertically
- Full-width buttons
- Reduced padding

---

## Interactive Elements

### Hover Effects
- **Stat Cards**: Subtle scale and shadow on hover
- **Buttons**: Brightness increase on hover
- **Input Fields**: Border color change on focus

### Loading States
- **Save Button**: Shows spinner icon while saving
- **Password Modal**: Spinner during password change
- **Initial Load**: Centered spinner before data loads

### Animations
- **Page Load**: Fade in from bottom (300ms)
- **Success Messages**: Slide in from top, auto-dismiss after 3s
- **Modal**: Fade in background, scale in modal (200ms)
- **Spinners**: Continuous rotation

---

## Typography

### Headings
- Page title: 24px, bold (TopBar)
- Section titles: 18px, bold
- Card titles: 15-16px, semi-bold

### Body Text
- Regular text: 14px
- Muted text: 13px
- Small labels: 11-12px

### Numbers (Stats)
- Large stats: 24px, extra bold
- Small numbers: 14px, semi-bold

### Font Family
- Primary: `Inter, sans-serif` (system fallback)

---

## Spacing System

### Padding
- Page wrapper: 24px
- Cards: 28px
- Stat cards: 20px
- Form groups: 16px margin-bottom

### Gap
- Grid gaps: 24px
- Flex gaps: 8-16px
- Input groups: 16px

### Border Radius
- Cards: 12px
- Buttons: 8px
- Badges: 20px (pill)
- Inputs: 8px
- Avatar: 50% (circle)

---

## Accessibility Features

### Keyboard Navigation
- Tab order: logical flow from top to bottom
- All interactive elements focusable
- Modal traps focus when open
- Escape key closes modal

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Form labels properly associated
- Status messages announced

### Visual
- High contrast ratios (WCAG AA)
- Focus indicators visible
- Error states clearly marked
- Loading states communicated

---

## Icons Used (Lucide React)

- `User` - Student ID field
- `Mail` - Email display
- `Phone` - Phone field
- `GraduationCap` - Department field
- `Hash` - Roll number field
- `Save` - Save button
- `Key` - Password button
- `LogOut` - Sign out button
- `BookOpen` - Borrowed books stat
- `Clock` - Pending requests stat
- `AlertCircle` - Fine alert stat
- `Calendar` - Due soon stat
- `CheckCircle` - Success messages
- `Loader2` - Loading spinner
- `Edit3` - Edit section icon
- `Shield` - Security notice
- `X` - Close modal button

---

## States & Variations

### Success State
```
✅ Profile updated successfully!
```
Green background, auto-dismisses in 3 seconds

### Error State
```
🚨 Failed to update profile: [error message]
```
Red background, stays until dismissed or new action

### Loading State
```
[🔄 Spinner] Loading...
```
Centered on page during initial load

### Empty State
If no phone/department/etc.:
- Shows placeholder text in gray
- Fields empty but editable

### Password Success
```
✅ Password changed successfully!
```
Appears in modal, auto-closes modal after 2 seconds

### Password Error
```
🚨 Current password is incorrect
```
Appears in modal, stays visible

---

This layout provides a professional, user-friendly interface for students to manage their profiles with clear visual hierarchy, intuitive interactions, and comprehensive functionality.
