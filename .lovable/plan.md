

# ClawCast UI/UX Overhaul - Chat Interface + Visual Polish

Transform ClawCast from a single-query tool into a modern conversational chat interface with enhanced visuals, mobile responsiveness, and local storage persistence.

---

## Summary

Convert the current "query -> result page" flow into a chat-based conversation experience with:
- Persistent chat threads stored in localStorage
- Collapsible sidebar showing thread history
- Inline evidence cards and confidence badges within chat messages
- Follow-up question support
- Enhanced animations, mobile responsiveness, and visual polish
- No new heavy dependencies (skip upload/export for now)

---

## Architecture

```text
+-------------------------------------------+
| Header (Logo, New Chat, Settings)         |
+----------+--------------------------------+
|          |                                |
| Chat     |  Chat Messages Area            |
| Sidebar  |  +---------------------------+ |
| (local   |  | User: "Will BTC hit..."   | |
| storage) |  +---------------------------+ |
|          |  +---------------------------+ |
| Thread 1 |  | ClawCast:                 | |
| Thread 2 |  |  [Confidence Badge]       | |
| Thread 3 |  |  [Key Drivers]            | |
|          |  |  [Evidence Cards]         | |
|          |  +---------------------------+ |
|          |  +---------------------------+ |
|          |  | User: "Follow-up..."      | |
|          |  +---------------------------+ |
+----------+--------------------------------+
| [Type your question...] [Send]            |
+-------------------------------------------+

Mobile (sidebar collapsed):
+-------------------------+
| hamburger ClawCast      |
+-------------------------+
| Chat Messages           |
| (full width)            |
|                         |
+-------------------------+
| [Type here...] [Send]  |
+-------------------------+
```

---

## New Dependencies

- `react-markdown` - Render AI responses with markdown formatting
- `zustand` - Lightweight state management for chat threads

No other new dependencies needed. Recharts is already installed.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/stores/chatStore.ts` | Zustand store for chat threads with localStorage persistence |
| `src/components/chat/ChatContainer.tsx` | Main chat viewport with message list and auto-scroll |
| `src/components/chat/ChatMessage.tsx` | User and assistant message bubbles with inline evidence |
| `src/components/chat/ChatSidebar.tsx` | Thread history list, collapsible, swipeable on mobile |
| `src/components/chat/MessageInput.tsx` | Bottom-fixed input with auto-resize textarea |
| `src/components/chat/InlineEvidenceCard.tsx` | Compact evidence card for inline display in chat |
| `src/components/chat/InlineConfidence.tsx` | Confidence badge + key drivers formatted for chat flow |
| `src/components/visualizations/SourceDistribution.tsx` | Bar chart showing evidence type breakdown |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Replace current layout with chat-based layout (sidebar + chat area) |
| `src/App.tsx` | No changes needed (single route stays) |
| `src/components/clawcast/ClawcastHeader.tsx` | Add hamburger menu for mobile, "New Chat" button |
| `src/components/clawcast/EvidencePanel.tsx` | Add Framer Motion animations, improve mobile accordion |
| `src/components/clawcast/ConfidenceBadge.tsx` | Add pulse animation on render |
| `src/components/clawcast/KeyDrivers.tsx` | Add staggered animation for bullet points |
| `src/components/clawcast/ResultCard.tsx` | Add source distribution chart |
| `src/components/clawcast/LoadingAnimation.tsx` | Show within chat as assistant "thinking" message |
| `src/hooks/useClawcastAnalysis.ts` | Support conversation context for follow-up queries |
| `src/index.css` | Add chat-specific CSS variables and semantic evidence colors |

---

## Implementation Details

### 1. Chat Store (Zustand + localStorage)

The store manages:
- List of chat threads (id, title, messages, createdAt, updatedAt)
- Active thread selection
- CRUD operations: create, rename, delete threads
- Add messages to threads
- Auto-save to localStorage via `safeStorage` utility
- Thread title auto-generated from first query

Each message has:
- role: "user" | "assistant"
- content: string (the query or text summary)
- analysisResult?: AnalysisResult (full structured data for assistant messages)
- timestamp: string
- isLoading?: boolean (for streaming feel)

### 2. Chat Container

- Renders list of ChatMessage components
- Auto-scrolls to latest message
- Shows loading state as a "thinking" assistant message bubble
- Empty state shows the current landing hero/trust indicators
- Handles follow-up queries by passing conversation history to the edge function

### 3. Chat Messages

**User messages**: Simple right-aligned bubble with the query text.

**Assistant messages**: Left-aligned with:
- Confidence badge (prominent, with pulse animation)
- Key drivers as bullet list
- Collapsible evidence panel (inline, not full-width)
- "What Could Change This" section
- Source distribution mini-chart
- Quick actions: Retry, Copy

### 4. Chat Sidebar

- Lists all threads sorted by most recent
- Shows thread title (first query, truncated) and timestamp
- Active thread highlighted
- "New Chat" button at top
- Delete thread with confirmation
- Collapsible: hidden on mobile by default, toggle via hamburger
- On mobile: slides in as overlay from left

### 5. Message Input

- Fixed to bottom of viewport
- Auto-resizing textarea (1-4 lines)
- Send button with keyboard shortcut (Enter to send, Shift+Enter for newline)
- Disabled while loading
- Placeholder changes based on context: "Ask about any future event..." vs "Ask a follow-up..."

### 6. Follow-up Context

When a thread has previous messages, the edge function receives conversation context:
- Previous queries and their confidence results
- This allows the AI synthesis to reference earlier findings
- The `useClawcastAnalysis` hook is updated to accept optional conversation context

### 7. Visual Enhancements

**Animations (Framer Motion)**:
- Messages slide in from bottom with fade
- Evidence cards stagger-animate when expanded
- Confidence badge pulses once on appear
- Key drivers animate in sequentially (0.1s delay each)
- Sidebar items animate with layout transitions

**Evidence Cards**:
- Add sentiment color indicator (left border: blue for news, green for market, purple for prediction)
- Hover state with subtle scale
- Improved mobile layout (stack vertically)

**Source Distribution Chart**:
- Small horizontal bar chart in assistant messages
- Shows count of news vs market vs prediction sources
- Uses Recharts (already installed)

**Mobile Responsiveness**:
- Bottom-fixed input (WhatsApp-style)
- Full-width messages on mobile
- Touch-friendly tap targets (min 44px)
- Swipe to open sidebar
- Evidence panel as full-height accordion on mobile

### 8. CSS Variables (added to index.css)

```text
--message-user-bg: slightly lighter than card
--message-assistant-bg: same as card
--evidence-news: blue tones
--evidence-market: green tones
--evidence-prediction: purple tones
--evidence-analysis: orange tones
```

### 9. Header Updates

- Left: Hamburger (mobile) + Logo
- Center: Thread title (if in active thread)
- Right: "New Chat" button + "AI-Powered Analysis" badge

---

## What Stays the Same

- Edge function logic (no changes needed)
- Confidence system (HIGH/MEDIUM/LOW)
- Disclaimer footer (shown at bottom of sidebar or below chat)
- All existing component logic (evidence panel, key drivers, etc.) - just wrapped in chat message context
- No authentication or database tables
- No user accounts

## What's Explicitly Skipped

- File upload/export (per your choice)
- Database persistence (using localStorage only)
- Streaming responses (simulated with loading states)
- Real-time WebSocket updates
- WCAG audit (can be done as follow-up)
- Unit tests (can be added separately)

