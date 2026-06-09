export default function getLanguage(path: string): string | null {
  const ext = '.' + path.split('.').pop();
  const map: Record<string, string> = {
    '.ts': 'TypeScript', '.tsx': 'TypeScript',
    '.js': 'JavaScript', '.jsx': 'JavaScript',
    '.py': 'Python', '.go': 'Go',
    '.java': 'Java', '.rb': 'Ruby',
    '.php': 'PHP', '.cs': 'C#',
    '.cpp': 'C++', '.c': 'C',
    '.swift': 'Swift', '.sql': 'SQL',
    '.sh': 'Shell', '.md': 'Markdown',
    '.json': 'JSON', '.yml': 'YAML',
    '.yaml': 'YAML', '.toml': 'TOML',
  };
  return map[ext] || null;
}