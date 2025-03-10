// utils/github.js
export const fetchRepoData = async () => {
  const repoUrl = 'https://api.github.com/repos/buildwizai/the-prompt-collection';
  const commitsUrl = `${repoUrl}/commits/main`;
  const workflowsUrl = `${repoUrl}/actions/runs`;

  const [repoResponse, commitResponse, workflowsResponse] = await Promise.all([
    fetch(repoUrl),
    fetch(commitsUrl),
    fetch(workflowsUrl),
  ]);

  if (!repoResponse.ok || !commitResponse.ok || !workflowsResponse.ok) {
    throw new Error('Failed to fetch repository data');
  }

  const repoData = await repoResponse.json();
  const commitData = await commitResponse.json();
  const workflowsData = await workflowsResponse.json();

  // Find the workflow run associated with the latest commit
  const latestWorkflowRun = workflowsData.workflow_runs.find(
    (run) => run.head_sha === commitData.sha
  );

  return {
    ...repoData,
    lastCommitHash: commitData.sha,
    deployJobUrl: latestWorkflowRun?.html_url || null, // Link to the deploy job
  };
};