// Splits the page Markdown into `llms-full/<name>.txt` files that fit in an agent context window.
// A folder within the limit is one file. A folder over the limit is split: subfolders over the
// limit get their own files, and the other subfolders and pages are packed into numbered parts.

export type LlmsPage = { slugs: string[]; text: string };
export type LlmsFullFile = { name: string; title: string; contents: string[]; pages: LlmsPage[]; text: string };

type Unit = { label: string; pages: LlmsPage[] };

const pageSeparator = '\n\n';

function byteSize(pages: LlmsPage[]): number {
  return pages.reduce((total, page) => total + Buffer.byteLength(page.text) + pageSeparator.length, 0);
}

function pageTitle(page: LlmsPage): string {
  return /^# (.+)/.exec(page.text)?.[1] ?? page.slugs.at(-1) ?? 'Home';
}

function slugTitle(slug: string): string {
  const words = slug.replace(/-/g, ' ');
  return words[0].toUpperCase() + words.slice(1);
}

/**
 * @param folderTitles Sidebar titles by folder path, for example `api` -> `API Reference`.
 */
export function splitLlmsFull(pages: LlmsPage[], maxBytes: number, folderTitles = new Map<string, string>()): LlmsFullFile[] {
  const sorted = [...pages].sort((a, b) => a.slugs.join('/').localeCompare(b.slugs.join('/')));
  const indexTitles = new Map(sorted.map((page) => [page.slugs.join('/'), pageTitle(page)]));
  const folderTitle = (path: string[]) => {
    const key = path.join('/');
    return folderTitles.get(key) ?? indexTitles.get(key) ?? slugTitle(path.at(-1) ?? '');
  };
  const files: LlmsFullFile[] = [];

  const add = (name: string, title: string, units: Unit[]) => {
    const group = units.flatMap((unit) => unit.pages);
    const contents = units.map((unit) => unit.label);
    files.push({ name, title, contents, pages: group, text: group.map((page) => page.text).join(pageSeparator) });
  };

  const visit = (prefix: string[], group: LlmsPage[]) => {
    const name = prefix.join('/') || 'overview';
    const title = prefix.map((_, index) => folderTitle(prefix.slice(0, index + 1))).join(' / ') || 'Overview';
    if (prefix.length > 0 && byteSize(group) <= maxBytes) {
      return add(name, title, [{ label: title, pages: group }]);
    }

    const depth = prefix.length;
    const folderKeys = new Set(group.filter((page) => page.slugs.length > depth + 1).map((page) => page.slugs[depth]));
    const folders = new Map<string, LlmsPage[]>();
    const units: Unit[] = [];
    for (const page of group) {
      const key = page.slugs[depth];
      if (key !== undefined && folderKeys.has(key)) folders.set(key, [...(folders.get(key) ?? []), page]);
      else units.push({ label: pageTitle(page), pages: [page] });
    }

    const largeFolders: Array<[string[], LlmsPage[]]> = [];
    for (const [key, folderPages] of folders) {
      const path = [...prefix, key];
      if (byteSize(folderPages) <= maxBytes) units.push({ label: folderTitle(path), pages: folderPages });
      else largeFolders.push([path, folderPages]);
    }

    const parts: Unit[][] = [];
    for (const unit of units) {
      const last = parts.at(-1);
      if (last && byteSize([...last.flatMap((item) => item.pages), ...unit.pages]) <= maxBytes) last.push(unit);
      else parts.push([unit]);
    }
    parts.forEach((part, index) => {
      if (parts.length === 1) add(name, title, part);
      else add(`${name}-${index + 1}`, `${title} (part ${index + 1} of ${parts.length})`, part);
    });

    for (const [path, folderPages] of largeFolders) visit(path, folderPages);
  };

  visit([], sorted);
  return files;
}
