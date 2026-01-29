# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a technical blog built with Next.js, designed for sharing programming knowledge and learning experiences.

## Commands

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build the static site
- `npm start` - Start production server

### Project Structure
- `src/app/` - Next.js App Router pages
- `posts/` - Blog posts directory (Markdown format)
- `lib/` - Utility functions and data fetching
- `docs/` - Work logs and documentation
- `todo.md` - Task management

## Writing Content

### Adding New Articles
1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter with title, date, category, and description
3. Write content in pure Markdown
4. Article automatically appears on homepage after build

### Frontmatter Format
```markdown
---
title: 'Article Title'
date: '2024-06-19'
category: 'Category Name'
description: 'Article description'
---
```

## Work Management

### Daily Work Logs (開発日誌)
- Create `docs/YYYY-MM-DD-{topic}.md` for each work session  
- **IMPORTANT**: Always use `date` command to check current date before creating work logs
- Include what was accomplished, challenges faced, emotions, and learnings
- Write freely as personal notes for future reference
- **Write in Japanese**

### TODO Management
- All tasks are tracked in `todo.md` - this is the single source of truth
- **DO NOT use TodoWrite tool** - manage tasks by directly editing `todo.md`
- Update task status immediately upon completion by editing the file
- Add new tasks as they arise by editing the file
- Include detailed subtasks for complex features
- Always read `todo.md` at the beginning of work sessions to understand current status
- Use TodoRead tool is not needed - just read the file directly with Read tool

### Work Log Template
```markdown
# YYYY-MM-DD 作業記録

## 今日やったこと
- [Completed tasks]

## 直面した課題
- [Challenges and solutions]

## 感情的な変化
- [Personal reflections]

## 技術的な学び
- [Technical insights]

## 次回への引き継ぎ
- [Notes for next session]
```

## Communication Guidelines

- All conversations with the user should be conducted in Japanese
- Code comments, commit messages, and issues should be written in English
- Documents under `docs/` directory should be written in Japanese
- Daily Work Logs (`docs/YYYY-MM-DD-{topic}.md`) should be written in Japanese
- This ensures accessibility for both Japanese and international developers

## Reference Documents

- **Requirements**: See `requirements.md` for detailed project requirements and specifications
- **Tasks**: See `todo.md` for current task list and project roadmap

## Configuration

- Claude Code permissions are configured in `.claude/settings.local.json`
- Repository is git-initialized on the `main` branch
- Next.js configuration in `next.config.ts`
