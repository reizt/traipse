export const makeRealPath = (path: string, params: Record<string, string>) => {
  let newPath = path;
  for (const param in params) {
    newPath = newPath.replace(`{${param}}`, params[param]!);
  }
  return newPath;
};

export const makeUrl = (root: string, path: string, searchParams: Record<string, string>) => {
  const url = new URL(`${root}${path}`);
  for (const key in searchParams) {
    const value = searchParams[key]!;
    if (Array.isArray(value)) {
      for (const v of value) {
        url.searchParams.append(key, v);
      }
    } else {
      url.searchParams.append(key, value);
    }
  }
  return url.toString();
};
