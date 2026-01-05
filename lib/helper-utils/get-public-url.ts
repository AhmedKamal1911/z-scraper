export function getPublicUrl(path?: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL as string;
  if (!path) return base;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
