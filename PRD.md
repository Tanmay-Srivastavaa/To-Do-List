# Product Requirements Document (PRD) — Folio To-Do & Focus System

## 1. Executive Summary
**Folio** is a mindful, high-productivity task management and focus web application. Inspired by calm, earth-toned editorial design, Folio combines day-planning, project tracking, label classification, Pomodoro-style focus sessions, and completion analytics into a cohesive, distraction-free workspace.

The application allows authenticated users to organize daily priorities, monitor project progress, log deep-work sessions, and analyze their productivity trends over time.

---

## 2. User Personas & Core Use Cases
- **The Focused Professional (e.g., Alex Morgan)**: Wants a calm daily dashboard that highlights 3 top priorities, groups upcoming tasks, and offers a 25-minute focus timer to eliminate context switching.
- **The Project Multi-Tasker**: Balances work tasks ("Website refresh"), personal errands ("Personal"), and self-improvement ("Learning"), tracking visual completion percentages across projects.
- **The Habit & Momentum Builder**: Uses weekly completion bar charts and milestone counters ("Small steps count") to maintain positive productivity loops.

---

## 3. Product Vision & Principles
1. **Calm Productivity**: Earthy olive, cream, and taupe aesthetic designed to lower anxiety and maintain focus.
2. **Prioritization First**: Strict grouping between top priorities (`YOUR PRIORITIES`) and upcoming items (`UP NEXT`).
3. **Low Friction**: Global quick search (`⌘K`) and instant task addition (`⌘N`).
4. **Data Integrity & Security**: Multi-tenant database design with OAuth 2.0 authentication; each user only accesses their own projects, tasks, and analytics.

---

## 4. Feature Requirements (Derived Directly from UI Reference)

### 4.1. Navigation & Workspace Sidebar
- **Brand Identity**: Logo with green rounded checkmark icon and "folio" typography.
- **Workspace Switcher**: Dropdown selector supporting team or personal workspaces (defaulting to the user's personal workspace).
- **Core Views**:
  - `Home` (Active dashboard view).
  - `Inbox` (Uncategorized tasks with badge counter).
  - `Today` (Tasks scheduled for the current date with badge counter).
  - `Upcoming` (Future dated tasks).
  - `Completed` (Archive of finished tasks).
- **Project Section (`MY PROJECTS`)**:
  - List of user-created projects with color-coded dot badges and active task counts:
    - *Website refresh* (Green badge, count).
    - *Personal* (Coral badge, count).
    - *Learning* (Lavender badge, count).
  - `+ New project` modal/action to create custom projects with custom color accents and icons.
- **Labels Section (`LABELS`)**:
  - Categorization tags: `# deep work`, `# little things`, etc.
  - Clicking a label filters tasks across projects.
- **Bottom Sidebar Navigation**:
  - `Invite a friend` modal / referral link trigger.
  - `Help & shortcuts` cheat sheet modal (listing `⌘K`, `⌘N`, `Esc`, etc.).
  - User Account Card: Shows user avatar, full name (`Alex Morgan`), plan type (`Personal plan`), and profile/logout menu.

### 4.2. Top Navigation Bar
- **Sidebar Collapse Toggle**: Icon button `[|]` to collapse/expand the left sidebar.
- **Breadcrumb Navigation**: Shows path (e.g., `/ Home`).
- **Global Search Bar**:
  - Input with placeholder `"Search anything..."`.
  - Keyboard shortcut indicator `⌘ K` / `Ctrl+K`.
  - Instant modal searching across task titles, notes, projects, and labels.
- **Notification Center**: Bell icon with unread status indicator badge.
- **User Avatar Profile Icon**: Quick-access profile dropdown.

### 4.3. Greeting & Stat Metrics Bar
- **Dynamic Header**:
  - Current Date: Uppercase, e.g., `MONDAY, NOVEMBER 9`.
  - Personalized Greeting: Dynamic by time-of-day: `"Good morning, [Name] ☀"`, `"Good afternoon"`, or `"Good evening"`.
  - Motivating Subtitle: `"A fresh start. Let's make room for what matters."`
  - Action Button: `+ Add task` primary button (accent forest green).
- **3 Top Stat Summary Cards**:
  1. **On your list today**: Shows total remaining tasks for today (e.g., `6 tasks to go`) with slider/list icon.
  2. **Already completed**: Shows completion ratio for the day (e.g., `3 of 9 tasks today`) with checkmark icon.
  3. **Time in focus**: Displays accumulated focus session minutes or motivational status (`a little better, every day`) with stopwatch icon.

### 4.4. Main Task Board Card
- **Tabbed Views**:
  - `All tasks` tab (displays active count badge, e.g., `6`).
  - `By project` tab (groups tasks by assigned project).
- **Toolbar**:
  - `⇅ Sort` dropdown (Sort by: Due Date, Priority, Title, Project).
  - `···` Card options menu (Bulk select, Export, Hide completed).
- **Section 1: `YOUR PRIORITIES`**:
  - Distinct banner with section counter (e.g., `3`).
  - Task item anatomy:
    - Checkbox (triggers complete animation & sound/haptic).
    - Project indicator dot (colored) + Project name.
    - Comments badge (e.g., `💬 2` or `💬 3`) indicating discussion count.
    - Label badge (e.g., `Deep work` in taupe pill badge).
    - Schedule time / badge (e.g., `🕒 10:00 AM`, `🕒 11:30 AM`, `🕒 Today`).
    - Priority flag icon (colored flag indicator for High/Medium/Low priority).
- **Section 2: `UP NEXT`**:
  - Distinct banner with section counter (e.g., `3`).
  - Tasks scheduled later in the day or unprioritized (e.g., `2:00 PM`, `6:00 PM`).
- **Quick-Add Task Row**:
  - Inline input trigger: `+ Add a task to your day` with shortcut badge `⌘ N` / `Ctrl+N`.
  - Enables instant task creation without leaving the keyboard.
- **Collapsible Completed Tasks**:
  - Expandable accordion: `> Completed today 3` on the left, with motivational subtext `Small steps count.` on the right.

### 4.5. Right Column Widgets
- **Widget 1: Tasks Completed (Weekly Bar Chart)**:
  - Header with timeframe dropdown: `Last 7 days ∨` (or `Last 30 days`).
  - Chart title: `tasks completed`.
  - 7-day bar chart displaying day columns (`T`, `W`, `T`, `F`, `S`, `S`, `M`) with varying height green bars.
  - Weekly comparison delta: `↗ 8 more than the previous week`.
- **Widget 2: Upcoming Schedule Card**:
  - Quick external expand link `↗`.
  - Date badges with month/day format:
    - Badge `TUE 10`: `Website refresh · 10:00 AM`.
    - Badge `THU 12`: `Personal · All day`.
- **Widget 3: Focus Session Card**:
  - Dark forest green nature backdrop with high-contrast typography.
  - Eyebrow: `A LITTLE LESS DISTRACTION`.
  - Header: `One thing at a time.`.
  - Action Button: White pill button `▷ Start focus`.
  - Duration indicator: `25 min session` (configurable Pomodoro timer).

### 4.6. Bottom Section: "Your projects"
- **Header**: `Your projects` heading with link `View all projects →`.
- **3 Project Overview Cards**:
  - **Card 1 (Website refresh)**:
    - Icon: Window/layout icon in light mint container.
    - Action: `···` menu.
    - Progress text: `8 of 20 tasks complete` | `40%`.
    - Progress bar: Green fill at 40%.
    - Next milestone note: `Next: Design review · Tomorrow`.
  - **Card 2 (Personal)**:
    - Icon: Coffee mug icon in light coral container.
    - Progress text: `3 of 8 tasks complete` | `38%`.
    - Progress bar: Coral fill at 38%.
    - Descriptive note: `A little space for everyday life`.
  - **Card 3 (Learning)**:
    - Icon: Open book icon in light lavender container.
    - Progress text: `6 of 10 tasks complete` | `60%`.
    - Progress bar: Lavender fill at 60%.
    - Next milestone note: `Next: Finish chapter 4 · Wednesday`.

---

## 5. Non-Functional Requirements
1. **Performance**: Initial page load < 1.2s; task completion/toggle latency < 100ms via optimistic UI updates.
2. **Security**: Multi-tenant data isolation, CSRF protection, secure OAuth 2.0 flow with HTTP-only session cookies.
3. **Accessibility**: Keyboard navigable (`Tab`, `Enter`, `Space`, `⌘K`, `⌘N`, `Esc`), WCAG 2.1 AA compliant color contrast ratios.
4. **Reliability & Persistence**: Relational database persistence (PostgreSQL) with ACID transaction guarantees.
5. **Responsiveness**: Responsive down to mobile (drawer sidebar, stacked widgets, swipeable project cards).
