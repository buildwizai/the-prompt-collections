---
summary: "Workflow agent role designer"
usage: "Define the agent roles, responsibilities, and collaboration patterns supporting the research-to-article workflow for consistent execution."
date: 2025-11-04
tags:
- automation
- system-prompt
- agent
- design
---
Identify the key individuals involved in the "Research a topic, and write an article" workflow. For each person, specify their role, goal, and backstory based on their responsibilities in the workflow. Use the provided input trigger keys (e.g., `topic`, `target_audience`, `article_length`, etc.) to enrich the descriptions and ensure alignment with the workflow's requirements. Use the following workflow description and input trigger as reference:

# Workflow Description
The "Research a topic, and write an article" workflow involves identifying a subject, gathering and analyzing relevant information from credible sources, and organizing the findings into a coherent structure. The process includes drafting, revising, and editing the article to ensure clarity, accuracy, and engagement. The final step is publishing or sharing the article with the intended audience, ensuring it meets their needs and expectations.

# Input Trigger
```javascript
# Input data for kicking off the "Research a topic, and write an article" workflow
research_article_inputs = {
    'topic': 'The Future of Renewable Energy',
    'target_audience': 'Policy Makers and Industry Leaders',
    'article_length': '1500 words',
    'tone': 'Persuasive and Data-Driven',
    'sources_preference': 'Government Reports, Academic Papers, and Industry Whitepapers',
    'deadline': '2025-11-04',
    'include_statistics': True,
    'include_expert_quotes': True,
    'call_to_action': 'Encourage investment in renewable energy projects'
}
```

# Output Requirements
- Provide the output in YAML format.
- Follow the structure and style of the examples below.
- Ensure each person's role, goal, and backstory are clearly defined and align with their responsibilities in the workflow.
- Incorporate relevant input keys (e.g., `topic`, `target_audience`, `article_length`, etc.) into the descriptions where applicable.

# Examples
```yaml
researcher:
  role: >
    {topic} AI Senior Data Researcher
  goal: >
    Uncover latest developments in {topic}
  backstory: >
    You're a seasoned researcher with a knack for uncovering the latest
    developments in {topic}. Known for your ability to find the most relevant
    information and present it in a clear and concise manner.

reporting_analyst:
  role: >
    {topic} Reporting Analyst
  goal: >
    Create detailed reports based on {topic} data analysis and research findings
  backstory: >
    You're a meticulous analyst with a keen eye for detail. You're known for
    your ability to turn complex data into clear and concise reports, making
    it easy for others to understand and act on the information you provide.
```

# Your Task
Identify the people involved in the "Research a topic, and write an article" workflow, and describe their role, goal, and backstory in YAML format. Ensure the output is consistent with the examples provided and incorporates relevant input keys from the trigger list.

---

# Expected Output Structure
```yaml
person_1:
  role: >
    [Role of the person, incorporating input keys where applicable]
  goal: >
    [Goal of the person, incorporating input keys where applicable]
  backstory: >
    [Backstory of the person, incorporating input keys where applicable]

person_2:
  role: >
    [Role of the person, incorporating input keys where applicable]
  goal: >
    [Goal of the person, incorporating input keys where applicable]
  backstory: >
    [Backstory of the person, incorporating input keys where applicable]
```
