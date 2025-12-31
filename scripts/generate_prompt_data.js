const fs = require("fs");
const path = require("path");

const promptsDir = path.join(__dirname, "../prompts");
const outputFilePath = path.join(__dirname, "../website/src/data/prompts.json");
const FRONT_MATTER_REGEX = /^---\n([\s\S]*?)\n---\n?/;

function parseFrontMatter(rawFrontMatter) {
  const data = {};
  let currentKey = null;

  rawFrontMatter.split("\n").forEach((line) => {
    const listItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (listItemMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(listItemMatch[1].trim());
      return;
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, rawValue] = keyValueMatch;
      const value = rawValue.trim();
      currentKey = key;

      if (!value) {
        data[key] = [];
      } else if (value.startsWith('"') && value.endsWith('"')) {
        data[key] = value.slice(1, -1);
      } else {
        data[key] = value;
      }
    } else {
      currentKey = null;
    }
  });

  return data;
}

function generatePromptData() {
  const allPrompts = [];

  function walkSync(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkSync(filePath);
      } else if (path.extname(file) === ".md") {
        const rawFileContent = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
        const relativePath = path.relative(promptsDir, filePath);
        const pathParts = relativePath.split(path.sep);

        const frontMatterMatch = rawFileContent.match(FRONT_MATTER_REGEX);
        const frontMatterData = frontMatterMatch ? parseFrontMatter(frontMatterMatch[1]) : {};
        const bodyOffset = frontMatterMatch ? frontMatterMatch[0].length : 0;
        const content = rawFileContent.slice(bodyOffset).trim();

        // Extract category and subcategories
        const category = pathParts[0];
        const subcategories = pathParts.slice(1, -1); // Exclude the file name

        // Tags come directly from front matter
        const tags = Array.isArray(frontMatterData.tags)
          ? Array.from(new Set(frontMatterData.tags.map((tag) => tag.trim()).filter(Boolean)))
          : [];

        // Extract other useful front matter fields
        const summary = typeof frontMatterData.summary === "string" ? frontMatterData.summary : "";
        const usage = typeof frontMatterData.usage === "string" ? frontMatterData.usage : "";
        const date = typeof frontMatterData.date === "string" ? frontMatterData.date : "";

        allPrompts.push({
          id: relativePath.replace(/\//g, "-").replace(/\.md$/, ""), // Unique ID
          category,
          subcategories,
          content,
          filename: file,
          tags,
          summary,
          usage,
          date,
        });
      }
    });
  }

  walkSync(promptsDir);

  fs.writeFileSync(outputFilePath, JSON.stringify(allPrompts, null, 2));
  console.log("Prompt data generated successfully!");
}

generatePromptData();
