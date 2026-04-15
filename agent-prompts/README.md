# ChartSnap AI - Agent Prompts

This folder contains ready-to-copy prompts for dispatching tasks to AI agents.

## Files

| File | Use When |
|------|----------|
| `frontend-agent-prompt.md` | Assigning work to Frontend SWE |
| `backend-agent-prompt.md` | Assigning work to Backend SWE |

## How to Use

### Option 1: Same Workspace (Multiple AI Tabs)
1. Open Windsurf secondary sidebar (Cmd+B)
2. Click "+" to add new AI chat
3. Select agent persona (Frontend/Backend Engineer)
4. Copy relevant prompt file contents
5. Paste into chat with any additional context

### Option 2: External AI (Discord/Slack/Cascade)
1. Copy entire prompt file
2. Paste into message
3. Attach reference files (PRD, task brief)
4. Send with clear deadline

### Option 3: Copy-Paste Quick Start
```bash
# Copy prompt to clipboard (macOS)
cat agent-prompts/frontend-agent-prompt.md | pbcopy

# Or open to manually copy
code agent-prompts/frontend-agent-prompt.md
```

## Before Sending

Checklist:
- [ ] PRD is finalized (`chartsnap-prd.md`)
- [ ] Task brief exists (`tasks/chartsnap-tasks-*.md`)
- [ ] Time estimate is reasonable
- [ ] Integration checkpoints are clear

## After Assignment

Track progress in project management:
- Day 1: Approach check-in
- Day 2: Progress demo
- Day 3: Integration testing

## Template Customization

Edit these sections per project:
1. **Project Context** - Update description
2. **Key Requirements** - Modify based on priorities
3. **API Contracts** - Update if changed
4. **Deliverables** - Adjust checklist
5. **Time Estimate** - Change as needed
