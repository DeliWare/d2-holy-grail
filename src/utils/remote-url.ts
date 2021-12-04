const MAXROLL_BASE_URL = 'https://d2planner.maxroll.gg/';

export function MakeUrl(baseUrl: string, path: string): string {
  path = path.trim();
  if (path[0] === '/') {
    path = path.substring(1);
  }
  return baseUrl + path;
}

export function MaxrollHost(path: string | undefined): string | undefined {
  if (typeof path === 'string') {
    return MakeUrl(MAXROLL_BASE_URL, path);
  } else {
    return undefined;
  }
}
