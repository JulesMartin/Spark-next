# Brouillons des mails Auto-Post

À relire et à réécrire avec ta voix avant de les créer dans Brevo. Ce sont des brouillons de Claude.

- Les chiffres viennent de ce que tu as donné pour la page de vente. Ne garde que ce que tu peux justifier.
- Aucun prix écrit en dur : il change selon les places (la landing le lit sur `/offre.json`).
- La fin de l'offre (15/11/2026) n'est citée nulle part : un contact inscrit tard la recevrait après la date.
- `[LIEN DU GUIDE]` : à remplacer, je n'ai pas le guide.
- Lien de vente de tous les mails : `https://auto-post.jules-api.com/?utm_source=brevo&utm_medium=email&utm_campaign=auto-post-seq-N`

Pied de chaque mail :

> Tu reçois ce mail parce que tu as demandé le guide Auto-Post. [Se désinscrire](https://jules-api.com/desinscription?t={{ contact.UNSUB_TOKEN }})

---

## Guide (`BREVO_TEMPLATE_AUTO_POST_GUIDE`, tout de suite)

**Objet : Ton guide est là**

Salut {{ contact.PRENOM }},

Voici le guide promis : [LIEN DU GUIDE]

Si tu veux voir comment je monte mes Reels sans logiciel de montage : [découvrir Auto-Post](lien de vente).

Jules

---

## Relance 1 (`SEQ_1`, J+1)

**Objet : Tu as pu ouvrir le guide ?**

Salut {{ contact.PRENOM }},

Si le mail d'hier t'a échappé, le guide est ici : [LIEN DU GUIDE]

Une question : qu'est-ce qui te prend le plus de temps quand tu sors une vidéo ? Pour la plupart des créateurs, c'est le montage. Couper les silences, les ratés, ajouter les sous-titres, les animations.

C'est pour ça que j'ai construit Auto-Post. Je t'explique demain comment ça marche, ou tu peux regarder la vidéo dès maintenant : [voir la vidéo](lien de vente).

Jules

---

## Relance 2 (`SEQ_2`, J+3)

**Objet : Tu filmes, l'IA monte**

Salut {{ contact.PRENOM }},

Auto-Post, c'est simple :

1. Tu filmes ta prise.
2. Claude la transcrit, coupe les silences et les ratés.
3. Il ajoute les sous-titres, les animations et les bruitages dans ton style.
4. Tu corriges ce que tu veux en cliquant, dans un studio visuel sur ton ordinateur.
5. Tu exportes, et tu publies depuis le calendrier.

Plus de 110 animations et effets, chacun appelé par une simple commande.

[Voir comment ça marche](lien de vente)

Jules

---

## Relance 3 (`SEQ_3`, J+5)

**Objet : Combien te coûte vraiment ton montage ?**

Salut {{ contact.PRENOM }},

Fais le calcul :

- **Tu montes toi-même.** Si ton heure vaut 50 € et que tu passes 10 heures par semaine à monter, ça te coûte environ 2 000 € par mois.
- **Tu délègues.** À 30 € le Reel, pour seulement 10 vidéos par mois, tu paies 300 €, et tu attends les délais du monteur.

Auto-Post, c'est un paiement unique, sans frais par vidéo, avec les mises à jour à vie.

Il te faut un abonnement Claude (Pro ou Max) : l'IA tourne avec ton compte, sur ton ordinateur. Le studio peut aussi fonctionner avec Codex.

[Voir l'offre](lien de vente)

Jules

---

## Relance 4 (`SEQ_4`, J+6)

**Objet : « Et si ça ne marche pas pour moi ? »**

Salut {{ contact.PRENOM }},

Les questions qui reviennent avant de se lancer :

**Il faut savoir coder ?** Non. À l'installation, il faut juste savoir copier-coller des commandes dans le Terminal, avec un guide pas à pas. Ensuite, tu pilotes tout depuis le studio visuel ou en parlant à Claude.

**Sur combien d'ordinateurs ?** Une clé marche sur 2 ordinateurs.

**Et si ça ne me convient pas ?** Tu peux te rétracter sans donner de motif pendant 14 jours et être remboursé intégralement, sur simple e-mail.

Une autre question ? Réponds à ce mail.

[Voir la page](lien de vente)

Jules

---

## Relance 5 (`SEQ_5`, J+8)

**Objet : Dernier mail là-dessus**

Salut {{ contact.PRENOM }},

C'est mon dernier mail sur Auto-Post, je ne vais pas insister.

Si le montage te prend du temps ou que tu repousses tes vidéos à cause de lui, regarde la page une dernière fois : [Auto-Post](lien de vente).

Sinon, pas de souci. Merci d'avoir lu.

Jules
