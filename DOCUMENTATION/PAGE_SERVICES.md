# Page Services — Documentation

## Vue d'ensemble

Deux offres de service présentées sur `/services`. Les formulaires de pré-qualification sont hébergés sur **Tally** et embarqués en iframe sur `/reserver`. Après soumission, Tally redirige automatiquement vers Calendly.

---

## Pages et routes

| Route | Rôle |
|---|---|
| `/services` | Page éditoriale présentant les deux offres |
| `/reserver?type=coaching` | Formulaire Tally coaching 1-to-1 (embed) |
| `/reserver?type=b2b` | Formulaire Tally B2B (embed) |

Pas d'API route côté Next.js — tout est géré par Tally (stockage des réponses, notification email, redirection).

---

## Offres

### Coaching IA 1-to-1
- Cible : indépendants, professionnels, reconversions
- Thèmes : Claude, automatisations, agents IA, workflows
- CTA → `/reserver?type=coaching`

### Accompagnement B2B
- Cible : entreprises et TPE
- Prestations : audit processus, intégration outils IA, formation équipe
- CTA → `/reserver?type=b2b`

---

## Formulaires Tally

| Type | ID Tally | URL embed |
|---|---|---|
| Coaching | `xX675d` | `https://tally.so/embed/xX675d` |
| B2B | `gDOVyl` | `https://tally.so/embed/gDOVyl` |

**Notifications** : configurées dans Tally → Settings → Notifications (email).  
**Redirection** : Tally → Settings → After submission → Redirect to URL → Calendly.  
**Données** : stockées dans le dashboard Tally, pas dans Supabase.

Pour modifier un formulaire : se connecter sur tally.so.

---

## Design

- **`/services`** : design éditorial du site public (fond `#F5F5F5`, typo Fraunces). Card coaching fond sombre `#1C1C1C`, card B2B fond blanc avec bordure.
- **`/reserver`** : design capture (fond jaune `#FCFCD0`, Raleway + Assistant, shadow néo-brutaliste `6px 6px 0 #1A1A1A`). Les iframes ont `transparentBackground=1` et `dynamicHeight=1` — elles s'adaptent à la hauteur du contenu Tally.

---

## Fichiers

```
app/services/page.tsx
app/reserver/page.tsx
app/reserver/layout.tsx
```

Navigation : `components/public/Header.tsx` et `components/public/Footer.tsx` (lien "Services").
