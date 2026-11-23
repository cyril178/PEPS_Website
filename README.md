# Site de l'étude PEPS

Site d'information pour les participant·es (patient·es et contrôles) de l'étude PEPS — UNIGE, Département de psychiatrie.
Stack : **Astro** (site statique) · **GitHub** (contenu versionné) · **Cloudflare Workers** (hébergement gratuit + URL d'aperçu par branche).

## Modifier le contenu

Tout le texte est dans des fichiers simples, aucun code à toucher :

| Quoi | Fichier |
|---|---|
| Pages (accueil, participer, pourquoi, volontaires sains, IRM, contact, données) | `src/content/pages/*.md` |
| Frise « Votre parcours » de l'accueil | champ `journey` dans `src/content/pages/accueil.md` |
| Questions fréquentes | `src/content/faq.yaml` |
| Équipe (rôle, présentation, motivation) | `src/content/team.yaml` |
| Contact, n° d'éthique, menu, mode brouillon | `src/data/site.json` |
| Vidéo de présentation | champ `video` dans `src/content/pages/pourquoi.md` |

**Formulaire de contact** (page Contact) : 3 champs, sans serveur. À l'envoi, le programme d'e-mail du visiteur s'ouvre avec le message prêt à partir, vers l'adresse de `site.json`. Rien n'est stocké sur le site.

- **Ajouter une page** : créer `src/content/pages/ma-page.md` (même en-tête que les autres) → elle est publiée sur `/ma-page/`. L'ajouter au menu dans `site.json` si besoin.
- **Vidéo** : mettre l'identifiant YouTube (`youtube: "dQw4w9WgXcQ"`, la partie après `v=`), de préférence en vidéo « non répertoriée ». Elle ne se charge qu'au clic, via youtube-nocookie. Un fichier local dans `public/videos/` marche aussi (`src: /videos/irm.mp4`), mais 25 Mo maximum par fichier sur Cloudflare.

### Les « [À COMPLÉTER : …] »

Les informations que je ne connaissais pas sont marquées `[À COMPLÉTER : …]`. Elles apparaissent **surlignées en jaune** sur le site tant que `"draft": true`.

```bash
npm run todo        # liste tout ce qui reste à compléter
```

Mode brouillon (`"draft": true` dans `site.json`) : bandeau « Version de travail » + `noindex` (pas de référencement Google).
Pour la mise en ligne officielle, passer à `"draft": false` : **le build échoue s'il reste un seul « À COMPLÉTER »**, pour éviter de publier des infos de recrutement incomplètes.

> ⚠️ Le matériel de recrutement doit être soumis à la CCER (via BASEC) avant diffusion. L'URL d'aperçu d'une branche est pratique pour envoyer une version figée à relire (Prof. Kaiser, commission).

## En local

```bash
npm install
npm run dev         # http://localhost:4321, rechargement automatique
npm run build       # génère ./dist
```

Node 22 ou plus.

## Mise en ligne (une seule fois)

### 1. GitHub

Créer un dépôt vide sur https://github.com/new (privé si vous voulez), puis :

```bash
git remote add origin https://github.com/<votre-compte>/peps-site.git
git push -u origin main
```

### 2. Cloudflare

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Import a repository** → autoriser GitHub, choisir `peps-site`.
2. Réglages de build :
   - **Build command** : `npm run build`
   - **Deploy command** : `npx wrangler deploy`
   - **Non-production branch deploy command** : `npx wrangler versions upload` (c'est ce qui crée les URL d'aperçu)
   - Activer **Builds for non-production branches**.
3. Déployer. Le site est sur `https://peps-site.<compte>.workers.dev`.
4. Plus tard : un vrai domaine dans **Settings → Domains & Routes**, puis mettre à jour `site` dans `astro.config.mjs`.

## Travailler au quotidien

```bash
git switch -c maj-faq          # une branche par changement
# … modifier les fichiers …
git commit -am "FAQ : ajoute la question sur le transport"
git push -u origin maj-faq
```

Ouvrir une Pull Request sur GitHub : Cloudflare y ajoute un commentaire avec l'**URL d'aperçu**. On relit, on fusionne dans `main` → la mise en ligne est automatique.

## Structure

```
src/
  content/          ← le contenu (Markdown/YAML)
  data/site.json    ← réglages globaux
  pages/            ← gabarits des pages (index, [slug], faq, contact, 404)
  components/       ← encadré « En bref », vidéo, en-tête de page, logo
  layouts/Base.astro← en-tête, menu, pied de page
  integrations/     ← vérification des « À COMPLÉTER » au build
  styles/global.css ← couleurs, typo (Atkinson Hyperlegible + Fraunces, hébergées localement)
wrangler.jsonc      ← config Cloudflare (site statique, page 404)
```

Pas de cookies, pas d'outil de mesure d'audience, pas de police Google chargée à distance.
