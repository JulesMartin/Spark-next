# Séquence de bienvenue (cron maison)

## Pourquoi on a quitté Brevo Automation

L'offre gratuite Brevo plafonne à **2 000 contacts uniques entrés dans les
automatisations actives**. Le compteur ne se vide pas quand un contact termine son
parcours : à ~1 720/2 000 en septembre 2026, on allait au-devant d'un blocage
silencieux (les nouveaux leads auraient reçu leur ressource, puis plus rien).

Or le workflow Brevo ne servait que de minuteur : ses cinq emails (templates 25 → 29)
partaient déjà en **transactionnel**, facturés sur le quota d'envoi (300/jour) et non
sur celui des automatisations. Le minuteur, on l'a en interne.

Bénéfice annexe : la désinscription devient exacte. Le statut `unsubscribed` est relu
avant chaque envoi, donc plus aucune histoire de condition de sortie de workflow
(voir `DESINSCRIPTION.md`).

## Fonctionnement

```
Capture (/api/capture ou /api/subscribe)
        ↓
email_subscribers.sequence_started_at = now()   ← si nouvelle campagne et champ vide
        ↓
Cron quotidien 9h (/api/cron/sync-sheet)
        ↓  étape A : synchro blacklist Brevo → Supabase
        ↓  étape A bis : runSequence()
        ↓
Pour chaque contact non désinscrit dont l'étape suivante est due :
  1 seul email par passage → template Brevo transactionnel
  sequence_step++, sequence_last_sent_at = now()
```

Le calendrier vit dans la constante `SEQUENCE` (`lib/sequence.ts`) :

| Étape | Template | Délai depuis l'étape précédente | Sujet |
|---|---|---|---|
| 1 | 25 | — (lendemain de la capture) | Ce que personne ne te dit sur l'IA |
| 2 | 26 | 2 jours | Tu prompts Claude comme 95% des gens |
| 3 | 27 | 2 jours | Tu perds entre 2 400 et 25 000€ par an |
| 4 | 28 | 1 jour | À quoi ressemble un audit gratuit |
| 5 | 29 | 2 jours | Tu as déjà perdu de l'argent |

Les délais sont comptés **d'étape à étape**, pas depuis la capture : le cron étant
quotidien, la première étape part le lendemain matin et les écarts suivants restent
justes. Seule différence avec l'ancien workflow Brevo : le premier email partait
environ 1h après la capture, il part maintenant le lendemain à 9h UTC (11h Paris).

## Règles

- **Une seule étape par contact et par passage.** Un contact en retard rattrape une
  étape par jour au lieu de recevoir trois emails d'un coup.
- **Une seule séquence par personne, à vie.** `sequence_started_at` est posé à la
  première capture, ou au retour d'un contact déjà en base sur une **nouvelle**
  campagne — c'est ce que faisait le workflow Brevo, qui redémarrait à chaque ajout à
  la liste #5. Une fois posé, le champ ne bouge plus : redemander la même ressource,
  ou une autre plus tard, ne rejoue jamais la séquence. Les désinscrits sont exclus.
- **Plafond d'envoi.** `SEQUENCE_DAILY_CAP` (défaut 120) limite chaque passage. Au-delà,
  les contacts restent dus et partent au passage suivant — rien n'est perdu. À garder
  sous les 300 emails/jour de l'offre gratuite Brevo, ressources de capture comprises
  (~215/jour en septembre 2026).
- **Désinscrits ignorés** deux fois : filtre SQL sur `unsubscribed`, plus la blacklist
  Brevo relue juste avant dans le même passage.
- **Échec d'envoi = étape non consommée.** `sendSequenceEmail` renvoie un booléen ;
  sans succès, `sequence_step` n'avance pas et l'email repartira demain.

## Bascule (25/09/2026)

Migration Supabase appliquée, cron en production, route de déclenchement manuel
vérifiée (`{"due":0,...}` au premier appel, aucun envoi parasite).



Seuls les contacts capturés **après** la bascule ont un `sequence_started_at`. Les
~1 900 déjà dans la liste Brevo #5 terminent leur parcours dans l'ancien workflow ;
aucun doublon possible. `upsertBrevoContact` n'ajoute plus personne à la liste #5,
donc le compteur d'automatisations Brevo a cessé d'augmenter.

Le workflow Brevo pourra être mis en pause une fois que plus personne n'y est actif
(≈ 8 jours après la bascule).

Angle mort assumé pendant ces 8 jours : un contact entré dans le workflow Brevo juste
avant la bascule, qui capture une **nouvelle** campagne avant d'avoir fini, démarre
notre séquence tout en recevant la fin de l'ancienne. Population concernée très
faible, fenêtre courte, et le workflow en pause referme le sujet.

## Tester

```bash
# Déclenchement manuel (ne touche pas au Google Sheet)
curl -H "Authorization: Bearer $CRON_SECRET" https://jules-api.com/api/cron/sequence
```

Réponse : `{ due, sent, failed, capped, skippedUnsubscribed }`.

Vérifier ensuite les envois réels côté Brevo :

```bash
curl -s -H "api-key: $BREVO_API_KEY" \
  "https://api.brevo.com/v3/smtp/statistics/events?limit=20&templateId=25&sort=desc"
```
