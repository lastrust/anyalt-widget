export function getImageURL(name: string) {
  return new URL(`../assets/imgs/${name}`, import.meta.url).href;
}
