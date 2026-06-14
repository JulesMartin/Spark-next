# Accès aux emails capturés & guide Brevo

## Où sont stockés les emails ?

Chaque email soumis via une page de capture est enregistré dans **Supabase**, table `email_subscribers`.

### Accéder à la table

**Lien direct :**
👉 https://supabase.com/dashboard/project/emixscupfsvvehjzjykx/editor?schema=public&table=email_subscribers

Ou manuellement :
1. Va sur https://supabase.com/dashboard
2. Ouvre le projet **spark-next** (`emixscupfsvvehjzjykx`)
3. Sidebar → **Table Editor** → `email_subscribers`

### Colonnes de la table

| Colonne      | Type        | Description                                      |
|-------------|-------------|--------------------------------------------------|
| `id`        | uuid        | Identifiant unique                               |
| `email`     | text        | Adresse email (lowercase, dédupliquée)           |
| `source`    | text        | Slug de la campagne (ex : `cowork-dm`, `default`) |
| `created_at`| timestamptz | Date d'inscription                               |

### Filtrer par campagne

Dans le Table Editor, utilise le filtre :
- Colonne : `source`
- Opérateur : `=`
- Valeur : le slug de ta campagne (ex : `cowork-dm`)

Ou en SQL (sidebar → **SQL Editor**) :
```sql
select email, created_at
from email_subscribers
where source = 'cowork-dm'
order by created_at desc;
```

---

## Brevo — mettre en place une nouvelle automatisation

Pour chaque nouvelle page de capture, tu as 3 choses à faire dans Brevo + 1 dans le code.

---

### Étape 1 — Créer l'email transactionnel (template)

1. Brevo → **Email** → **Templates** → **Créer un template**
2. Donne-lui un nom parlant, ex : `Ressource - Cowork DM`
3. Rédige le mail (objet + corps), utilise `{{ contact.EMAIL }}` si besoin de personnalisation
4. **Publie** le template
5. Note l'**ID numérique** du template (visible dans l'URL ou la liste des templates)

---

### Étape 2 — Ajouter l'attribut CAMPAIGN dans Brevo

> Brevo stocke `CAMPAIGN` comme attribut de contact — ça permet de savoir depuis quelle page chaque contact est arrivé.

1. Brevo → **Contacts** → **Paramètres des contacts** (ou Settings → Contact attributes)
2. Section **Attributs de contact** → **Ajouter un attribut**
3. Nom : `CAMPAIGN` (en majuscules, exactement comme ça)
4. Type : **Texte**
5. Sauvegarder

> ⚠️ C'est un attribut global à créer **une seule fois**. Si tu l'as déjà, passe directement à l'étape 3.

---

### Étape 3 — Ajouter la campagne dans le code

Ouvre le fichier `lib/brevo.ts` et ajoute une ligne dans `CAMPAIGN_TEMPLATES` :

```ts
const CAMPAIGN_TEMPLATES: Record<string, number> = {
  'cowork-dm': 3,        // ← exemple existant
  'mon-nouveau-slug': 12, // ← ajoute ici : slug → ID du template Brevo
}
```

Le `slug` doit correspondre exactement au paramètre `?c=` de l'URL de ta page de capture.
Ex : `/capture?c=mon-nouveau-slug`

---

### Étape 4 — Créer la page de capture

Redirige vers `/capture?c=mon-nouveau-slug` depuis ta pub / ton lien bio.

La page lit automatiquement le paramètre `c` et l'utilise comme slug de campagne.

---

## Résumé d'une nouvelle campagne

```
1. Créer le template dans Brevo → noter l'ID
2. Vérifier que l'attribut CAMPAIGN existe dans Brevo (une fois pour toutes)
3. Ajouter dans lib/brevo.ts : 'mon-slug': ID_DU_TEMPLATE
4. Lien de ta pub : sparkmedia.fr/capture?c=mon-slug
5. Les emails arrivent dans Supabase → colonne source = 'mon-slug'
```

---

## Campagnes actives

| Slug        | Template Brevo | Description               |
|------------|----------------|---------------------------|
| `cowork-dm` | 3              | Ressource Cowork DM       |

> Mets à jour ce tableau à chaque nouvelle campagne.
