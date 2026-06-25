# Système de capture par campagne

## Architecture

Un seul lien, un seul paramètre `?c=` qui change selon le post Instagram.

```
tonsite.com/capture?c=guide-reels
tonsite.com/capture?c=audit-instagram
tonsite.com/capture?c=prompt-pack
```

## Flux d'inscription

```
Visiteur remplit le formulaire
        ↓
POST /api/capture { email, campaign }
        ↓
Supabase → email_subscribers (email, source = campaign)
        ↓
Brevo → contact créé/mis à jour avec attribut CAMPAIGN = "guide-reels"
        ↓
Brevo automation → détecte CAMPAIGN = "guide-reels" → envoie le bon email
```

## Fichiers créés

| Fichier | Rôle |
|---|---|
| `app/capture/page.tsx` | Page standalone cream/jaune, lit `?c=` |
| `app/capture/layout.tsx` | Charge Raleway + Assistant (next/font) |
| `components/capture/CaptureForm.tsx` | Formulaire client (honeypot, états) |
| `app/api/capture/route.ts` | API : Supabase + Brevo |
| `lib/brevo.ts` | Helper `upsertBrevoContact` |
| `app/dashboard/leads/page.tsx` | Table leads par campagne (dashboard) |

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `app/api/subscribe/route.ts` | Resend supprimé → Brevo |
| `app/dashboard/layout.tsx` | Lien "Leads" ajouté au sidebar |
| `.env.local` | `BREVO_API_KEY` + `BREVO_LIST_ID` ajoutés |

## Variables d'environnement à renseigner

```env
BREVO_API_KEY=""     # dashboard.brevo.com → SMTP & API → API Keys
BREVO_LIST_ID=""     # ID liste Brevo (optionnel)
```

## Setup Brevo (à faire une fois)

1. Créer l'attribut contact `CAMPAIGN` (type : Texte) dans Brevo
2. Créer une automatisation par campagne :
   - Déclencheur : "Contact ajouté ou mis à jour"
   - Condition : `CAMPAIGN = "prompts-ia"`
   - Action : envoyer l'email correspondant

## Workflow Instagram (récurrent)

Pour chaque nouveau post :

1. **ManyChat / bio** — changer `?c=` dans le lien (`?c=nouveau-contenu`)
2. **Brevo** — dupliquer une automatisation existante, changer le filtre `CAMPAIGN` et l'email
3. **Zéro code**

## Dashboard leads

URL : `/dashboard/leads` (protégé par Supabase auth)

- Tableau : Email · Campagne · Date d'inscription
- Stats par campagne en haut (nb d'inscrits)
- Trié par date décroissante
