# Sizzle reel

A 30-second, 1080p trailer for the apps, made with [Remotion](https://www.remotion.dev) (video written as React code). No sound.

`trailer-v3.mp4` is the latest render. It was made before the move to tinkerandwander.com, so it needs the updates listed below.

## Structure (30 fps, 900 frames)

| Time | Scene |
|---|---|
| 0–3s | "How do I make new things approachable?" / "For my daughter. And for me." |
| 3–6s | For my daughter: "How do we learn together what she's learning at school?" |
| 6–10s | Riya's Wonder Lab |
| 10–13s | For our culture: "She saw a Ramayana play. Now she keeps asking why." |
| 13–18s | Riya's Ramayana |
| 18–21s | For me: "When we're sick, my mom says ginger, lemon and cloves. I wanted to know why." |
| 21–25s | Ayu |
| 25–30s | "AI made building them approachable too." / "Built with Codex and Claude" / the app addresses |

All scenes and wording are in `src/Trailer.tsx`. Screenshots and fonts are in `public/`. Fonts are bundled so rendering needs no network.

## Needs updating

- The closing addresses read `vaishalimittal.com/wonder`, `/ramayana`, `/ayu`. Change them to tinkerandwander.com.
- Anaaj (the sourdough app) isn't in it.
- The Ayu question is the old wording. The site now says "When I was sick, my mom made ginger lemon water with cloves. I never knew why."
- Consider adding the tinker and wander name and logo bricks.

## Render

```bash
cd trailer
npm install
npx remotion render src/index.ts Trailer out/trailer.mp4 --codec=h264 --crf=18
```

In a cloud session with a preinstalled Chromium, add `--browser-executable=<path to chrome-headless-shell>`.
