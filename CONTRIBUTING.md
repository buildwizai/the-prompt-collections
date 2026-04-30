# Contributing to The Prompt Collection

Thank you for your interest in contributing to The Prompt Collection! We welcome
contributions from the community to help grow and improve our prompt repository.

## How to Contribute

### Adding New Prompts

1. **Create a new prompt file** in the appropriate category/subcategory folder
   under the `prompts/` directory.
2. Use the naming convention: `category_subcategory_prompt_name.md`
3. Include YAML front matter with the following fields:

```yaml
---
summary: "Brief description of the prompt"
usage: "How to use this prompt"
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
---
```

4. Add your prompt content after the front matter.

### Adding System Prompts

System prompts are prefixed with `system_` in the filename and provide context
for the AI:

- Example: `system_writing_fiction_author.md`
- Place system prompts in the category folder, not in subcategories

### Updating the Website Data

After adding or modifying prompts, regenerate the JSON data for the website:

```bash
node scripts/generate_prompt_data.js
```

This script parses all markdown files in `prompts/` and outputs to
`website/src/data/prompts.json`.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/buildwizai/the-prompt-collection.git
   cd the-prompt-collection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Branching Strategy

We use a simplified GitHub Flow:

- `main` - Production-ready code
- `feat/*` - New features and prompts
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

Create feature branches from `main`:

```bash
git checkout -b feat/your-feature-name
```

## Commit Conventions

We follow [Conventional Commits](https://conventionalcommits.org):

```
<type>(<scope>): <description>

[optional body]
```

Types:
- `feat`: New prompt or feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructure
- `chore`: Maintenance

Examples:
```
feat(stock): add technical analysis prompt
fix(writing): correct grammar prompt template
docs: update contributing guidelines
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`feat/your-feature-name`)
3. Make your changes following the prompt format
4. Run the data generator: `node scripts/generate_prompt_data.js`
5. Commit with a clear message
6. Push to your fork and submit a PR

### PR Requirements

- [ ] Prompts follow the naming convention
- [ ] YAML front matter is included and valid
- [ ] Data generator runs successfully
- [ ] Changes are tested locally

## Coding Standards

- Use clear, descriptive filenames
- Include helpful summaries in front matter
- Add relevant tags for discoverability
- Update README if adding new categories or subcategories

## Testing

Before submitting a PR, verify:

1. The website builds without errors
2. New prompts appear correctly in the browse interface
3. Search functionality works with new tags

## Questions?

- Open an issue for discussions
- Email: [buildwizai@gmail.com](mailto:buildwizai@gmail.com)

We appreciate every contribution, whether it's a new prompt, bug fix, or
documentation improvement!