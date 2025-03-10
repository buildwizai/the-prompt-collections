// generatePrompts.js
const fs = require('fs');
const { faker } = require('@faker-js/faker'); // Updated import

// Define categories and tags for prompts
const categories = [
  'ai-tools',
  'coding',
  'productivity',
  'writing',
  'marketing',
  'education',
  'health',
  'finance',
  'entertainment',
  'uncategorized',
];

const tags = [
  'system',
  'ai',
  'github',
  'copilot',
  'vscode',
  'python',
  'javascript',
  'react',
  'nodejs',
  'writing-tips',
  'marketing-strategy',
  'education-tools',
  'health-tips',
  'finance-tools',
  'entertainment-news',
];

// Function to generate a random prompt
const generatePrompt = (id) => {
  const category = faker.helpers.arrayElement(categories); // Updated method
  const subcategories = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
    faker.lorem.word().toLowerCase()
  );
  const tagsForPrompt = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
    faker.helpers.arrayElement(tags)
  );

  return {
    id: `prompt-${id}`,
    category: category,
    subcategories: subcategories,
    content: faker.lorem.paragraphs({ min: 1, max: 5 }),
    isSystemPrompt: faker.datatype.boolean(),
    filename: `${category}_${faker.lorem.word().toLowerCase()}_${id}.md`,
    tags: tagsForPrompt,
  };
};

// Generate 1000 prompts
const prompts = Array.from({ length: 1000 }, (_, index) => generatePrompt(index + 1));

// Save prompts to a JSON file
fs.writeFileSync('prompts.json', JSON.stringify(prompts, null, 2));

console.log('Generated prompts.json with 1000 prompts.');