Based on the workflow description and the defined agents, identify and describe the tasks each agent is responsible for in the "Research a topic, and write an article" workflow. For each task, provide a **description**, **expected output**, and the **agent** assigned to it. Use the following workflow and agents as reference:

**Workflow Description:**
The "Research a topic, and write an article" workflow involves identifying a subject, gathering and analyzing relevant information from credible sources, and organizing the findings into a coherent structure. The process includes drafting, revising, and editing the article to ensure clarity, accuracy, and engagement. The final step is publishing or sharing the article with the intended audience, ensuring it meets their needs and expectations.

**Agents:**
```yaml
topic_lead:
  role: >
    Topic Lead
  goal: >
    Identify and define the subject of the article, ensuring it aligns with audience interests and organizational goals
  backstory: >
    You're a strategic thinker with a deep understanding of audience needs and industry trends. Known for your ability to pinpoint compelling topics that resonate with readers and drive engagement.

researcher:
  role: >
    Research Specialist
  goal: >
    Gather and analyze credible information on the chosen topic to provide a solid foundation for the article
  backstory: >
    You're a detail-oriented researcher with a talent for uncovering valuable insights from diverse sources. Your ability to synthesize complex information into actionable data makes you an invaluable part of the team.

writer:
  role: >
    Content Writer
  goal: >
    Draft a well-structured and engaging article based on the research findings
  backstory: >
    You're a skilled writer with a passion for storytelling and a knack for turning raw data into compelling narratives. Your ability to communicate clearly and creatively ensures the article resonates with its audience.

editor:
  role: >
    Content Editor
  goal: >
    Revise and refine the article to ensure clarity, accuracy, and alignment with the intended tone and style
  backstory: >
    You're a meticulous editor with a sharp eye for detail and a deep understanding of language and grammar. Known for your ability to polish content to perfection, you ensure the article meets the highest standards.

publisher:
  role: >
    Publishing Coordinator
  goal: >
    Finalize and distribute the article to the intended audience through appropriate channels
  backstory: >
    You're a highly organized professional with expertise in content distribution and audience engagement. Your ability to manage timelines and platforms ensures the article reaches its audience effectively and on time.
```

**Output Requirements:**
1. Provide the output in **YAML format**.
2. Follow the structure and style of the examples below.
3. Ensure each task's **description**, **expected_output**, and **agent** are clearly defined.

**Examples:**
```yaml
research_task:
  description: >
    Conduct a thorough research about {topic}.
    Make sure you find any interesting and relevant information given
    the current year is 2025.
  expected_output: >
    A list with 10 bullet points of the most relevant information about {topic}.
  agent: researcher

reporting_task:
  description: >
    Review the context you got and expand each topic into a full section for a report.
    Make sure the report is detailed and contains any and all relevant information.
  expected_output: >
    A fully fledged report with the main topics, each with a full section of information.
    Formatted as markdown without '```'.
  agent: reporting_analyst
```

**Your Task:**
Identify tasks for each agent in the "Research a topic, and write an article" workflow. For each task, describe its **description**, **expected_output**, and **agent** in YAML format. Ensure the output is consistent with the examples provided.

---

**Expected Output Structure:**
```yaml
task_1:
  description: >
    [Description of the task]
  expected_output: >
    [Expected output of the task]
  agent: >
    [Agent ID]

task_2:
  description: >
    [Description of the task]
  expected_output: >
    [Expected output of the task]
  agent: >
    [Agent ID]
```