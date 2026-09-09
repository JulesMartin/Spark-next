# Désinscription

## Fonctionnement

1. Chaque email Brevo contient un bouton **Se désinscrire** pointant vers
   `https://jules-api.com/desinscription?t={{ contact.UNSUB_TOKEN }}`
2. `UNSUB_TOKEN` est un attribut Brevo écrit automatiquement à chaque capture
   (`upsertBrevoContact`). Format : `base64url(email).signature-HMAC` — l'email est
   embarqué dans le token, donc pas de second paramètre d'URL à encoder.
3. La page `/desinscription` vérifie la signature (`lib/unsubscribe-token.ts`), affiche
   l'adresse concernée et demande une case à cocher de confirmation.
4. `POST /api/unsubscribe` :
   - Supabase : `campaigns = []`, `unsubscribed = true`, `unsubscribed_at = now()`
     — **la ligne n'est jamais supprimée**, seuls les tags sont vidés
   - Brevo : sortie de la liste séquence (`BREVO_SEQUENCE_LIST_ID`, défaut `5`),
     attribut `CAMPAIGNS` vidé, et `emailBlacklisted: true`

La blacklist est ce qui coupe réellement une automation déjà démarrée — sortir de la
liste seul n'arrête pas un workflow en cours.

Le cron `sync-sheet` lit déjà la blacklist Brevo et propage vers Supabase + Google Sheet,
donc les désinscriptions faites depuis le lien natif de Brevo restent cohérentes.

## Mise en place (une seule fois)

1. **Brevo** → Contacts → Paramètres → Attributs → créer un attribut **texte** nommé
   `UNSUB_TOKEN`.
2. **Env** : `UNSUBSCRIBE_SECRET` (déjà dans `.env.local`) à ajouter dans Vercel
   (Production + Preview). Ne jamais la changer : tous les liens déjà envoyés
   deviendraient invalides.
3. **Backfill** des contacts existants :
   ```bash
   node scripts/backfill-unsub-token.mjs --dry   # vérification
   node scripts/backfill-unsub-token.mjs         # écriture
   ```
4. Coller le bloc footer ci-dessous en bas de chaque template Brevo.

## Bloc footer à coller dans les templates Brevo

```html
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;border-top:1px solid #e0e0e0;">
  <tr>
    <td style="padding:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#888888;">
      <p style="margin:0 0 12px;">
        Tu reçois cet email parce que tu as téléchargé une ressource gratuite sur
        <a href="https://jules-api.com" style="color:#888888;">jules-api.com</a>.
      </p>
      <p style="margin:0 0 16px;">
        Jules Martin — Entreprise Individuelle — SIREN 988 699 591<br>
        <a href="mailto:contact@jules-api.xyz" style="color:#888888;">contact@jules-api.xyz</a>
      </p>
      <p style="margin:0 0 16px;">
        <a href="https://jules-api.com/desinscription?t={{ contact.UNSUB_TOKEN }}"
           style="display:inline-block;padding:8px 16px;border:1px solid #cccccc;border-radius:3px;font-size:12px;color:#666666;text-decoration:none;">
          Se désinscrire
        </a>
      </p>
      <p style="margin:0;">
        <a href="https://jules-api.com/confidentialite" style="color:#888888;">Politique de confidentialité</a>
        &nbsp;·&nbsp;
        <a href="https://jules-api.com/mentions-legales" style="color:#888888;">Mentions légales</a>
      </p>
    </td>
  </tr>
</table>
```

> Note conformité : la LCEN et la CNIL attendent aussi une adresse postale de l'expéditeur
> dans les emails de prospection (elle figure ici uniquement via la page Mentions légales).
> Choix assumé — à réévaluer si Brevo le réclame côté anti-abus.
