export default function (path: string): string {
  const config = useRuntimeConfig();
  const baseURL = config.app.baseURL;

  if (path.startsWith("/")) {
    return baseURL + path.substring(1);
  }
  return path;
}
