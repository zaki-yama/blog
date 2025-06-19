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

### Daily Work Logs
- Create `docs/YYYY-MM-DD.md` for each work session
- Include what was accomplished, challenges faced, emotions, and learnings
- Write freely as personal notes for future reference

### TODO Management
- All tasks are tracked in `todo.md`
- Update task status immediately upon completion
- Add new tasks as they arise
- Include detailed subtasks for complex features

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
- All repository documentation, code comments, and commit messages should be written in English
- This ensures accessibility for both Japanese and international developers

## Reference Documents

- **Requirements**: See `requirements.md` for detailed project requirements and specifications
- **Tasks**: See `todo.md` for current task list and project roadmap

## Configuration

- Claude Code permissions are configured in `.claude/settings.local.json`
- Repository is git-initialized on the `main` branch
- Next.js configuration in `next.config.ts`
