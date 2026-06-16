# Accès aux emails capturés & guide Brevo

Exemple URL: jules-api.com/capture?c=cowork-dm

## Où sont stockés les emails ?

Chaque email soumis via une page de capture est enregistré dans **Supabase**, table `email_subscribers`.  
**Une seule ligne par personne.** Si quelqu'un soumet plusieurs pages de capture, ses campagnes s'accumulent dans le tableau `campaigns`.

### Accéder à la table

1. Va sur https://supabase.com/dashboard
2. Ouvre le projet **spark-next**
3. Sidebar → **Table Editor** → `email_subscribers`

### Colonnes de la table

| Colonne         | Type        | Description                                                        |
|----------------|-------------|--------------------------------------------------------------------|
| `id`           | uuid        | Identifiant unique                                                 |
| `email`        | text        | Adresse email (lowercase, **unique**)                              |
| `source`       | text        | Première campagne (historique)                                     |
| `campaigns`    | text[]      | Toutes les campagnes déclenchées (ex: `{cowork-dm, prompts-ia}`)  |
| `social_handle`| text        | Pseudo Instagram/TikTok/etc. saisi dans le formulaire (optionnel)  |
| `created_at`   | timestamptz | Date d'inscription                                                 |

### Filtrer par campagne

Dans le SQL Editor :
```sql
select email, campaigns, social_handle, created_at
from email_subscribers
where 'cowork-dm' = ANY(campaigns)
order by created_at desc;
```

Ou pour voir tous les abonnés avec leur pseudo :
```sql
select email, campaigns, social_handle, created_at
from email_subscribers
where social_handle is not null
order by created_at desc;
```

---

## Google Sheets (Excel)

Le sheet suit le même principe : **une ligne par email**.  
Colonnes : `email | campaigns (virgule-séparés) | social_handle | first_seen | last_updated`

Si quelqu'un soumet une 2ème campagne, sa ligne est mise à jour (pas une nouvelle ligne créée).

> **Note** : les anciennes lignes (avant la migration) ont l'ancien format 3 colonnes (`email, source, date`). Un copier-coller manuel ou un nettoyage ponctuel du sheet suffit à homogénéiser.

---

## Brevo — comportement contact

Brevo déduplique automatiquement par email (un seul contact par personne).

Attributs du contact :
- `CAMPAIGNS` : toutes les campagnes, séparées par virgule (ex: `cowork-dm,prompts-ia`)
- `SOCIAL_HANDLE` : pseudo réseau social (si renseigné)

> **Action manuelle requise (une seule fois)** : créer ces deux attributs dans Brevo si pas encore fait.  
> Brevo → **Contacts** → **Paramètres des contacts** → **Ajouter un attribut**  
> - `CAMPAIGNS` (Texte)  
> - `SOCIAL_HANDLE` (Texte)
>
> L'ancien attribut `CAMPAIGN` (singulier) n'est plus utilisé. Tu peux l'ignorer.

L'email de la campagne n'est **envoyé qu'une seule fois par campagne par personne**. Si quelqu'un soumet à nouveau la même page de capture, aucun email n'est renvoyé.

---

## Brevo — mettre en place une nouvelle automatisation

Pour chaque nouvelle page de capture, tu as 2 choses à faire dans Brevo + 1 dans le code.

### Étape 1 — Créer l'email transactionnel (template)

1. Brevo → **Email** → **Templates** → **Créer un template**
2. Donne-lui un nom parlant, ex : `Ressource - Cowork DM`
3. Rédige le mail (objet + corps), utilise `{{ contact.EMAIL }}` si besoin
4. **Publie** le template
5. Note l'**ID numérique** du template

### Étape 2 — Ajouter la campagne dans le code

Ouvre `lib/brevo.ts` et ajoute une ligne dans `CAMPAIGN_TEMPLATES` :

```ts
const CAMPAIGN_TEMPLATES: Record<string, number> = {
  'cowork-dm': 3,
  'mon-nouveau-slug': 12, // ← slug → ID template Brevo
}
```

Le slug doit correspondre exactement au paramètre `?c=` de l'URL.

### Étape 3 — Créer la page de capture

Lien de ta pub : `sparkmedia.fr/capture?c=mon-nouveau-slug`

La page lit automatiquement le paramètre `c`.

---

## Résumé d'une nouvelle campagne

```
1. Créer le template dans Brevo → noter l'ID
2. Ajouter dans lib/brevo.ts : 'mon-slug': ID_DU_TEMPLATE
3. Lien de ta pub : sparkmedia.fr/capture?c=mon-slug
4. Les emails arrivent dans Supabase → colonne campaigns inclut 'mon-slug'
```

---

## Campagnes actives

| Slug        | Template Brevo | Description               |
|------------|----------------|---------------------------|
| `cowork-dm` | 3              | Ressource Cowork DM       |

> Mets à jour ce tableau à chaque nouvelle campagne.
