# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a technical blog built with Mintlify, designed for sharing programming knowledge and learning experiences.

## Commands

### Development
- `npm run dev` - Start Mintlify development server
- `npm run build` - Build the static site
- `npx mintlify dev` - Alternative way to start dev server

### Project Structure
- `mint.json` - Main configuration file for Mintlify
- `introduction.mdx` - Homepage content
- `posts/` - Blog posts directory (MDX format)

## Writing Content

- Blog posts are written in MDX format in the `posts/` directory
- Update `mint.json` navigation section when adding new posts
- Use Mintlify components like `<Note>`, `<Tip>`, `<Warning>`, `<Info>` for rich content

## Configuration

- Claude Code permissions are configured in `.claude/settings.local.json`
- Repository is git-initialized on the `main` branch
- Mintlify configuration in `mint.json`
