import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are bundled with the project so rendering needs no network access.
const FACES: [family: string, file: string, weight: string][] = [
  ["Bricolage Grotesque", "bricolage-700-latin.woff2", "700"],
  ["DM Sans", "dmsans-500-latin.woff2", "500"],
  ["DM Sans", "dmsans-700-latin.woff2", "700"],
  ["Baloo 2", "baloo-700-latin.woff2", "700"],
  ["Baloo 2", "baloo-700-devanagari.woff2", "700"],
];

const handle = delayRender("Loading fonts");
Promise.all(
  FACES.map(([family, file, weight]) =>
    new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight }).load().then((f) => {
      document.fonts.add(f);
    }),
  ),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error(err);
    continueRender(handle);
  });

export const display = "'Bricolage Grotesque', sans-serif";
export const body = "'DM Sans', sans-serif";
export const baloo = "'Baloo 2', sans-serif";
