# tinker and wander

The home page (tinkerandwander.com) for the small apps Vaishali Mittal builds with her daughter and for herself.

- `index.html`: the whole page (no build step)
- `images/`: app screenshots and the About photo
- `vercel.json`: serves each app under this domain

## The apps

Each app is its own Vercel project. This site forwards to them, the same way vaishalimittal.com does.

| Path | App | Vercel project |
|---|---|---|
| `/wonder` | Riya's Wonder Lab | `riyas-wonder-lab` |
| `/ramayana` | Riya's Ramayana | `riyas-ramayana` |
| `/ayu` | Ayu | `ayu` |
| (link out) | Anaaj | hosted on Lovable at anaaj.lovable.app |

The old addresses on vaishalimittal.com (`/wonder`, `/ramayana`, `/ayu`) keep working; they are forwarded in that site's `next.config.mjs`.

## Updating

Edit `index.html`, commit and open a pull request. Merging to `main` redeploys the site.
