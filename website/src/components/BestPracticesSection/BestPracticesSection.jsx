import React from "react";
import { FaLightbulb } from "react-icons/fa";

const bestPractices = [
  {
    title: "Define Clear Objectives",
    description:
      "Know what outcome you expect before drafting the prompt so the model has a focused target.",
  },
  {
    title: "Give Context and Constraints",
    description:
      "Include relevant background, tone, audience, and format requirements to guide the response style.",
  },
  {
    title: "Break Complex Tasks Down",
    description:
      "Use step-by-step instructions or numbered tasks to help the model reason through each part.",
  },
  {
    title: "Iterate and Refine",
    description:
      "Review the output, adjust the prompt with clarifications or follow-up constraints, and run it again.",
  },
  {
    title: "Provide Exemplars When Possible",
    description:
      "Add short examples of good outputs to set expectations and reduce guessing from the model.",
  },
];

const BestPracticesSection = () => {
  return (
    <section className="mt-12">
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaLightbulb className="w-6 h-6 text-yellow-500" />
          Prompt Engineering Best Practices
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {bestPractices.map((item, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestPracticesSection;
