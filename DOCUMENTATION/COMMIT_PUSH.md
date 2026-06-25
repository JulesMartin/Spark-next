# Commit & push du projet

Guide pour committer et pousser proprement sur GitHub. Le push sur `main` déclenche le déploiement Vercel automatiquement.

---

## 1. Voir ce qui a changé

```bash
git status            # fichiers modifiés / ajoutés / non suivis
git diff              # détail des modifications non indexées
git diff --staged     # détail de ce qui est déjà indexé
```

---

## 2. Indexer les fichiers

```bash
git add <fichier1> <fichier2>      # ajouter des fichiers précis (recommandé)
git add .                          # TOUT ajouter (à éviter si fichiers parasites)
```

> ⚠️ Avant un `git add .`, vérifie `git status` : des dossiers comme `dist/` ou `.claude/skills/` peuvent traîner et ne doivent pas forcément partir dans le repo. Préfère ajouter les fichiers un par un, ou ajoute-les à `.gitignore`.

---

## 3. Committer

```bash
git commit -m "Décris le changement à l'impératif (ex: Add cron sync-sheet)"
```

Message multi-lignes :

```bash
git commit -m "Titre court" -m "Détail sur une ou plusieurs lignes."
```

---

## 4. Pousser

```bash
git push origin main
```

Le push sur `main` lance un déploiement de production sur Vercel.

---

## Travailler sur une branche (recommandé pour les gros changements)

```bash
git checkout -b nom-de-la-branche     # créer + basculer sur une branche
# ... commits ...
git push -u origin nom-de-la-branche  # premier push de la branche
```

Vercel crée alors un **déploiement preview** (URL de test) sans toucher la prod.
Ensuite, ouvrir une Pull Request sur GitHub et merger dans `main` quand c'est validé.

```bash
gh pr create --fill        # créer la PR depuis le terminal (si gh installé)
```

---

## Annuler / corriger

```bash
git restore <fichier>             # annuler les modifs non indexées d'un fichier
git restore --staged <fichier>    # désindexer (garder les modifs)
git commit --amend                # corriger le dernier commit (avant push)
git reset --soft HEAD~1           # défaire le dernier commit, garder les changements
```

> Ne jamais `git push --force` sur `main`.

---

## Vérifier après push

- Onglet **Deployments** du projet sur Vercel : le build doit passer au vert.
- Les variables d'env (ex. `CRON_SECRET`) doivent exister dans Vercel **avant** que le code qui en dépend ne tourne.
