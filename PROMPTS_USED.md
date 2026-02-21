# Prompts Used for Development

This document records the prompts used to develop the Competitive Intelligence Tracker application.

---

## Initial Project Setup Prompt

```
Build a web app where I can:
* add 5–10 competitor links (pricing page, docs page, changelog)
* click "check now" to fetch content and store it
* show "what changed since last check" (diff)
* generate a summary of changes with citations/snippets
* show a history of last 5 checks per competitor

Make it your own: for example, add tags, alerts, or "changes that matter" filters.

What to include:
* A simple home page with clear steps
* A status page, that shows health of backend, database, and llm connection.
* Basic handling for empty/wrong input
* A short README: how to run, what is done, what is not done
* A short AI_NOTES.md: what you used AI for, and what you checked yourself. Which LLM and provider does your app use and why.
* Put your name and resume in ABOUTME.md
* A PROMPTS_USED.md, with records of your prompts used for app development. Don't include agent responses, api keys, etc.

Hosting requirement:
* Hosting is important for this role.
* Keep the app live after you submit.
* If you truly cannot host, you may submit without hosting only if:
  - the repo runs with one command using Docker, and
  - you explain why hosting was not possible
* This will be scored lower than a hosted submission.
* If your link is down during review, you get one chance to fix it.
* It should have LLM integration working for us to test.
```

---

## Technology Stack Selection

**Implicit decisions made:**
- Next.js 14 with App Router for full-stack capability
- TypeScript for type safety
- Prisma + SQLite for quick database setup
- OpenAI GPT-3.5-turbo for LLM integration
- Tailwind CSS for styling
- Docker for containerization

---

## Database Schema Design

**Considerations:**
- Competitor → Links (one-to-many)
- Links → Checks (one-to-many)
- Checks → Changes (one-to-many)
- Competitor → Alerts (one-to-many)
- Cascade deletes for clean data management

---

## API Endpoint Design

**REST endpoints created:**
- `GET/POST /api/competitors` - List and create competitors
- `GET/DELETE/PATCH /api/competitors/[id]` - Manage specific competitor
- `POST/GET /api/links` - Add and list competitor links
- `DELETE /api/links/[id]` - Remove a link
- `POST /api/check` - Check a single link
- `POST /api/check-all` - Check all links for a competitor
- `GET /api/status` - System health check
- `POST/DELETE /api/alerts` - Manage keyword alerts

---

## Feature Implementation Prompts

### Diff Generation
**Requirement:** Generate text diffs between old and new content
**Approach:** Used the `diff` library with line-by-line comparison

### AI Summary Generation
**Requirement:** Generate summaries with citations
**Approach:** Structured GPT-3.5 prompt with JSON output format

### Change Significance Detection
**Requirement:** Filter for "changes that matter"
**Approach:** Count changed lines, mark as significant if > 5 lines changed

### Frontend UI
**Requirement:** Clear, intuitive interface
**Approach:** Card-based layout with expandable sections, modal dialogs for forms

---

## Error Handling Decisions

- Validate URLs before saving
- Handle fetch failures gracefully
- Continue checking even if LLM fails
- Show clear error messages to users
- Fallback behavior when OpenAI API is unavailable

---

## Docker Configuration

**Requirement:** One-command Docker setup
**Approach:** Multi-stage build, initialize database on startup

---

## Testing Considerations

**Manual testing performed:**
- Adding/deleting competitors
- Adding various URL types
- Running checks and viewing diffs
- Testing with invalid inputs
- Checking status page accuracy
- Testing with and without OpenAI key

---

## Refinement Prompts

Throughout development, implicit refinements were made for:
- Better error messages
- Loading states and spinners
- Dark mode support
- Responsive design
- Input validation
- Empty state handling

---

## Documentation Prompts

Created comprehensive documentation for:
- README with setup instructions
- AI_NOTES explaining AI usage
- ABOUTME template for developer info
- This PROMPTS_USED file
- Code comments where needed

---

## Notes

- No API keys or sensitive data included in this document
- No agent responses included (as requested)
- Prompts are high-level showing decision-making process
- Actual implementation details available in code comments
