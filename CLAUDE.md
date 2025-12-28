# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Prompt Collection is a curated repository of AI prompts organized by categories (writing, coding, business, etc.). It includes a React website for browsing, searching, and using prompts. Hosted at prompts.buildwizai.com.

## Repository Structure

- `prompts/` - Markdown files containing prompts, organized by category subdirectories
- `website/` - React + Vite frontend application
- `scripts/` - Build utilities for generating prompt data

## Common Commands

### Website Development
```bash
cd website
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Generate Prompt Data
After adding/modifying prompts, regenerate the JSON data:
```bash
node scripts/generate_prompt_data.js
```
This parses all markdown files in `prompts/` and outputs to `website/src/data/prompts.json`.

## Architecture

### Prompt File Format
Prompts use markdown with YAML front matter:
```yaml
---
summary: "Brief description"
usage: "How to use this prompt"
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
---
# Prompt content here
```

- System prompts are prefixed with `system_` in filename
- File naming convention: `category_subcategory_prompt_name.md`
- ID derived from relative path with `/` replaced by `-`

### Data Flow
1. `scripts/generate_prompt_data.js` reads all `.md` files from `prompts/`
2. Parses front matter and content
3. Outputs structured JSON to `website/src/data/prompts.json`
4. React app loads and displays the prompt data

### Website Stack
- React 18 with Vite
- Tailwind CSS for styling
- Lucide React + React Icons for icons
- Vercel Analytics integration
