import { execFileSync } from 'node:child_process';

const dateLine = /^\d{4}-\d{2}-\d{2}$/;

/** First-seen path wins, so the map stores the newest commit date for each file. */
export function parseGitLogDates(output: string): Map<string, string> {
  const dates = new Map<string, string>();
  let current = '';

  for (const line of output.split('\n')) {
    if (!line) continue;
    if (dateLine.test(line)) {
      current = line;
      continue;
    }
    if (current && !dates.has(line)) dates.set(line, current);
  }

  return dates;
}

export function loadGitLastModified(repoRoot: string): Map<string, string> {
  try {
    const output = execFileSync(
      'git',
      ['-c', 'safe.directory=*', '-C', repoRoot, 'log', '--pretty=format:%cs', '--name-only'],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
    return parseGitLogDates(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`sitemap lastmod: git history unavailable (${message}). Falling back to file dates.`);
    return new Map();
  }
}
