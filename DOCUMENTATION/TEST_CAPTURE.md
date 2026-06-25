# Test du système de capture

Prérequis : migration SQL Supabase exécutée, app en local (`npm run dev`).

---

## 1. Préparer un email de test

Utilise une adresse jetable : [https://temp-mail.org](https://temp-mail.org)  
Garde-la ouverte dans un onglet pendant tout le test.

---

## 2. Test A — Nouvelle inscription

1. Va sur `localhost:3000/capture?c=cowork-dm`
2. Entre l'email de test + un pseudo (`@test_insta`)
3. Clique "Recevoir gratuitement"

**Vérifier :**
- [ ] Supabase → `email_subscribers` : 1 seule ligne, `campaigns = {cowork-dm}`, `social_handle = @test_insta`
- [ ] Email reçu dans temp-mail (template Brevo `cowork-dm`)
- [ ] Brevo → contact créé avec `CAMPAIGNS = cowork-dm`, `SOCIAL_HANDLE = @test_insta`
- [ ] Google Sheets → 1 ligne : `email | cowork-dm | @test_insta | date | date`

---

## 3. Test B — Même email, même campagne (anti-doublon)

1. Resoumet **le même email** sur `localhost:3000/capture?c=cowork-dm`

**Vérifier :**
- [ ] Supabase → toujours **1 seule ligne** (pas de doublon)
- [ ] **Aucun email** reçu dans temp-mail
- [ ] Google Sheets → toujours **1 seule ligne** (colonne `last_updated` mise à jour)

---

## 4. Test C — Même email, nouvelle campagne

> Si tu n'as pas de 2ème campagne configurée, ajoute temporairement `'test-campagne': 0` dans `lib/brevo.ts` — l'email ne sera pas envoyé (template ID 0) mais le reste est testable.

1. Resoumet **le même email** sur `localhost:3000/capture?c=test-campagne`

**Vérifier :**
- [ ] Supabase → toujours **1 seule ligne**, `campaigns = {cowork-dm, test-campagne}`
- [ ] Brevo → contact mis à jour : `CAMPAIGNS = cowork-dm,test-campagne`
- [ ] Google Sheets → ligne mise à jour : campaigns = `cowork-dm,test-campagne`

---

## 5. Test D — Email neuf sans pseudo

1. Nouvel email de test, soumet sans renseigner le champ pseudo

**Vérifier :**
- [ ] Supabase → `social_handle` est `NULL` (pas de chaîne vide)
- [ ] Google Sheets → colonne social_handle vide (pas d'erreur)
