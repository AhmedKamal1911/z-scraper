export function getPublicUrl(path?: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL as string}/${path}`;
}
