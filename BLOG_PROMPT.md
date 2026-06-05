# Prompt de génération d'article blog

À partir du transcript ci-dessous, génère un article de blog en français pour une audience tech/SaaS/IA (18-34 ans, solopreneurs, créateurs de contenu, indépendants).

## Règles de rédaction

- Titre accrocheur et honnête — pas clickbait, pas de "vous n'allez pas le croire"
- Introduction directe qui pose le problème ou l'enjeu — jamais "Dans cet article nous allons voir..."
- Structure en H2/H3 logique, texte dense, listes seulement si vraiment utiles
- Ton éducatif et pragmatique : comme si tu expliquais à un ami intelligent ce que tu viens d'apprendre
- CTA final court vers la chaîne YouTube (ex: "Retrouve la vidéo complète sur la chaîne.")
- 600 à 900 mots maximum
- Pas de conclusion bateau type "En résumé, nous avons vu que..."

## Écriture humaine — anti-patterns IA à éliminer

Ces règles s'appliquent à TOUS les champs : titre, excerpt et body.

### Mots et formules bannis

Vocabulaire IA typique à ne jamais utiliser : *essentiel, crucial, incontournable, fascinant, captivant, pionnier, paradigme, paysage (au sens figuré), tissu (au sens figuré), dynamique (adjectif fourre-tout), robuste, granulaire, holistique, synergique, naviguer (au sens figuré), transformer, révolutionner, démocratiser, innover, booster, décrypter, explorer, plonger dans*.

Formules d'introduction interdites : "Dans cet article", "Plongeons dans", "Voici ce qu'il faut savoir", "La vraie question est", "Au fond", "Ce qui compte vraiment", "Sans plus attendre".

Conclusions creuses interdites : "L'avenir est prometteur", "Les possibilités sont infinies", "Le monde évolue vite", "Une chose est sûre".

### Grammaire et style

- **Zéro tiret em (—) ou tiret demi-cadratin (–).** Utilise une virgule, un point ou deux-points à la place.
- **Pas de gras mécanique.** Ne bolde que ce qui est réellement un terme technique ou un nom propre. Pas de phrases entières en gras.
- **Pas de règle de trois forcée.** Si la liste n'a pas naturellement 3 éléments, n'en invente pas un troisième.
- **Voix active.** Évite la voix passive pour masquer l'acteur.
- **Variation de longueur de phrases.** Alterne courtes et longues — pas de rythme uniforme.
- **Pas de copule évitée.** Écris "c'est" plutôt que "cela se présente comme" ou "cela constitue".

### Contenu

- **Avoir un avis.** Ne pas juste relater — prendre position, dire ce qui est bien ou ce qui pose problème.
- **Pas de profondeur de façade.** Ne pas ajouter de participes présents ou de subordonnées pour donner l'illusion de nuance.
- **Pas d'attributions vagues.** Ne pas écrire "selon les experts" ou "des études montrent" sans source précise — omets simplement si tu n'as pas la source.
- **Titres en sentence case.** Première lettre majuscule, reste en minuscules (sauf noms propres).

## Format de sortie attendu

Retourne UNIQUEMENT un objet JSON valide avec ces champs :

```json
{
  "title": "Titre de l'article",
  "slug": "titre-de-l-article-en-kebab-case-sans-accents",
  "excerpt": "Résumé en 1-2 phrases qui donne envie de lire (max 160 caractères)",
  "body": "Corps de l'article en markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "youtubeUrl": "URL YouTube de la vidéo source"
}
```

Note : `coverImageUrl` est générée automatiquement par le script depuis `youtubeUrl`, ne l'inclure pas dans le JSON.

## Transcript
