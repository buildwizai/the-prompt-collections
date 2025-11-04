---
summary: "System prompt for The Prompt Collection is a curated repository of diverse prompts designed for various purposes, such as writing, interviews, and more."
usage: "Load this prompt as the system message when you need the assistant to act as The Prompt Collection is a curated repository of diverse prompts designed for various purposes, such as writing."
date: 2025-11-04
tags:
- code
- development
- system-prompt
- collection
- project
---
<project>
<description>
Prompt Collection

The Prompt Collection is a curated repository of diverse prompts designed for various purposes, such as writing, interviews, and more. Each category and subcategory includes a set of prompts along with corresponding system prompts.

System prompts are used to define personas and scenarios, providing context to help generate more relevant and focused responses. To distinguish them from regular prompts, all system prompts are prefixed with system_ in their filenames.

# Example Structure
	- Writing Prompts
	- Fiction
	- System Prompt: system_fiction_author.md
“You are a fictional author writing a story about a character who is on a journey to find their true identity.”
	- Prompt: fiction_meet_mysterious_figure.md
“Write a scene where the character meets a mysterious figure who challenges them to confront their fears.”
	- Non-Fiction
	- System Prompt: system_nonfiction_researcher.md
“You are a non-fiction writer researching a historical event and interviewing witnesses.”
	- Prompt: nonfiction_interview_paragraph.md
“Write a paragraph describing what you learned from your interview with the witness.”

Each prompt is stored in its own markdown (.md) file, containing only the prompt text for easy copying and reuse.

A README.md file is included to provide an overview of the Prompt Collection, guidelines for usage, and instructions for contributing new prompts or system prompts to the repository.

This structure ensures that prompts are well-organized, easy to navigate, and simple to integrate into various workflows.
</description>
<project-page>
The project’s webpage will be hosted at prompts.buildwizai.com and should include a module for generating a static site directly from the project files.

# Features
	- Search Functionality
	- A search bar will allow users to filter prompts by category, subcategory, or keywords in their description.
	- Results will be dynamically displayed for quick navigation.
	- Prompt Management
	- Users can select and open a prompt, modify it directly on the page, and copy the updated text with a dedicated button.
	- System prompts will be clearly labeled with a “system” tag to distinguish them from regular prompts.
	- Design and Layout
	- The website will be a single-page, static, and fully responsive application for seamless use across devices.
	- Built using Vite for fast development and TailwindCSS for modern, efficient styling.
	- Scalability and Performance
	- The site must be optimized to handle a large dataset (e.g., 10,000+ prompts) while maintaining fast load times and smooth navigation.
	- The interface will prioritize cleanliness, usability, and high performance.

# Technical Requirements
	- Use Vite to create a single-page application (javascript).
	- Implement TailwindCSS for consistent and scalable styling.
	- Ensure the site is modular to support future enhancements and easy maintenance.

The result will be a robust, user-friendly platform that efficiently organizes and manages a vast collection of prompts while offering a sleek and responsive user experience.
</project-page>
</project>
