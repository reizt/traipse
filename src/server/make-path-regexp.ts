export const makePathRegExp = (path: string) => {
  return new RegExp(`^${path.replaceAll(/{([^}]+)}/g, '(?<$1>[^/?]+)')}[^/]*$`);
};
