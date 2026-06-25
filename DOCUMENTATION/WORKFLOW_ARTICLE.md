# Workflow : URL YouTube → Article SEO → Draft Sanity

## Déclencheur

Quand l'utilisateur dit **"publie [url youtube]"**, exécuter les étapes ci-dessous dans l'ordre.

---

## Étape 1 — Récupérer le transcript

Utiliser **`yt-dlp`** pour extraire les sous-titres directement (méthode fiable). `WebFetch` sur la page YouTube ne renvoie pas le transcript, et les services tiers (youtubetranscript.com) renvoient souvent un 403.

1. Extraire l'ID vidéo depuis l'URL fournie (ex. `https://youtu.be/[VIDEO_ID]` ou `watch?v=[VIDEO_ID]`).
2. Télécharger les sous-titres (préférer `fr`, sinon `en`) dans le scratchpad :

```bash
yt-dlp --skip-download --write-auto-sub --write-sub \
  --sub-lang "fr,fr-FR,en" --sub-format vtt \
  -o "vid.%(ext)s" "https://youtu.be/[VIDEO_ID]"
```

3. Nettoyer le `.vtt` en texte brut : retirer l'en-tête `WEBVTT`, les lignes de timestamp (`-->`), les balises inline (`<...>`), et dédupliquer les lignes consécutives identiques (les auto-subs se répètent). Joindre en un seul bloc continu.

```bash
python3 - << 'PY'
import re
raw = open('vid.fr.vtt', encoding='utf-8').read()
out = []
for ln in raw.splitlines():
    if not ln.strip() or ln.startswith(('WEBVTT','Kind:','Language:')) or '-->' in ln:
        continue
    ln = re.sub(r'<[^>]+>', '', ln).strip()
    if ln and (not out or out[-1] != ln):
        out.append(ln)
open('transcript.txt','w',encoding='utf-8').write(re.sub(r'\s+',' ',' '.join(out)).strip())
PY
```

> `yt-dlp` est installé (`/opt/homebrew/bin/yt-dlp`). En cas de `HTTP 429` sur une langue, l'autre langue passe en général ; relancer suffit.

---

## Étape 2 — Générer l'article

Appliquer **simultanément** les deux fichiers de règles :

| Fichier | Rôle | Priorité |
|---|---|---|
| `BLOG_PROMPT.md` | Style éditorial, ton, anti-patterns IA, format JSON de sortie | Primaire |
| `SEO-optimization.md` | Structure SEO, mots-clés, FAQ, richesse sémantique | Secondaire |

### Règles de fusion

Quand les deux fichiers se contredisent, appliquer ceci :

- **Style > SEO mécanique.** `BLOG_PROMPT.md` interdit le gras mécanique et les listes forcées — cette règle prime sur les instructions SEO qui demandent d'en abuser.
- **Structure SEO dans les limites du style.** Utiliser H2/H3, listes et FAQ quand le contenu s'y prête naturellement, pas pour remplir une case.
- **Mots-clés naturels.** Intégrer le mot-clé principal dans la première phrase, un ou deux titres H2, et la conclusion — jamais en force.

### Ce que l'article doit contenir

- **Titre** : sentence case, mot-clé principal dedans, accrocheur sans être clickbait.
- **Introduction** : première ligne directe avec le mot-clé, pas de "Dans cet article...".
- **Corps** : H2/H3 logiques, 600-900 mots, exemples concrets, avis tranché.
- **FAQ** : 3 à 5 questions courtes que quelqu'un taperait sur Google, réponses en 2-3 phrases.
- **CTA final** : une phrase vers la chaîne YouTube.
- **Tags** : 4 à 6 tags pertinents, en kebab-case.

### Format de sortie

Retourner uniquement un objet JSON valide :

```json
{
  "title": "Titre de l'article",
  "slug": "titre-en-kebab-case-sans-accents",
  "excerpt": "Résumé 1-2 phrases, max 160 caractères",
  "body": "Corps complet en markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "youtubeUrl": "https://youtu.be/..."
}
```

`coverImageUrl` est calculée automatiquement par le script depuis `youtubeUrl`, ne pas l'inclure.

---

## Étape 3 — Créer le draft dans Sanity

```bash
echo '<json>' | node scripts/create-sanity-post.mjs
```

Le script :
- vérifie les doublons de slug avant de créer
- crée le document avec `status: "draft"`
- retourne l'ID du document et le lien Sanity Studio

---

## Étape 4 — Confirmer à l'utilisateur

Afficher :
- Titre
- Slug
- Lien direct : `https://spark-studio.sanity.studio/structure/post;<ID>`

L'utilisateur relit et publie manuellement depuis Sanity Studio.

---

## Infos Sanity

| Paramètre | Valeur |
|---|---|
| Project ID | `u7ptqvl2` |
| Dataset | `production` |
| Script | `scripts/create-sanity-post.mjs` |
| Studio (local) | `http://localhost:3000/studio` |
| Studio (prod) | `https://spark-studio.sanity.studio` |

---

## Anti-patterns à éviter absolument

- Ne jamais publier directement — toujours `status: "draft"`.
- Ne jamais créer un doublon de slug.
- Ne pas inventer de faits absents du transcript.
- Ne pas forcer une FAQ si le sujet ne s'y prête pas (mieux vaut 3 vraies questions que 5 creuses).
