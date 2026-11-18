// Gestion de l'accès à l'espace membres /section (mot de passe commun, sessions) dans la base Supabase.
// Usage (depuis spark-next) :
//   node --env-file=.env.local scripts/section-acces.mjs mot-de-passe            → crée un NOUVEAU mot de passe au hasard, le met en base (haché) et déconnecte tout le monde
//   node --env-file=.env.local scripts/section-acces.mjs mot-de-passe "<valeur>" → met ce mot de passe précis (ex. première installation)
//   node --env-file=.env.local scripts/section-acces.mjs sessions                → combien de membres connectés, dernières connexions, essais ratés
//   node --env-file=.env.local scripts/section-acces.mjs revoquer-tout           → déconnecte tout le monde (sans changer le mot de passe)
// Le mot de passe n'est JAMAIS stocké en clair : seule son empreinte scrypt est en base (format identique à lib/section-access.ts).
import { createClient } from '@supabase/supabase-js'
import { randomBytes, scryptSync } from 'node:crypto'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const [cmd, arg] = process.argv.slice(2)
const fail = (msg) => { console.error(msg); process.exit(1) }

function generate() {
  // 5 groupes de 5 caractères, sans 0/O/1/l/I
  const al = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const pick = () => al[randomBytes(1)[0] % al.length]
  const ok = (s) => /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s)
  for (;;) {
    const pw = Array.from({ length: 5 }, () => Array.from({ length: 5 }, pick).join('')).join('-')
    if (ok(pw)) return pw
  }
}
function hash(password) {
  const salt = randomBytes(16)
  const N = 16384, r = 8, p = 1
  const key = scryptSync(password, salt, 32, { N, r, p })
  return `scrypt$${N}$${r}$${p}$${salt.toString('base64')}$${key.toString('base64')}`
}
async function revokeAll() {
  const { data, error } = await supabase.from('section_sessions').update({ revoked_at: new Date().toISOString() }).is('revoked_at', null).gt('expires_at', new Date().toISOString()).select('id')
  if (error) fail('Erreur : ' + error.message)
  return data.length
}

if (cmd === 'mot-de-passe') {
  const password = (arg ?? generate()).trim()
  if (password.length < 16) fail('Mot de passe trop court (16 caractères minimum).')
  const { data: cur } = await supabase.from('section_settings').select('ip_salt').eq('id', 1).maybeSingle()
  const { error } = await supabase.from('section_settings').upsert({
    id: 1,
    password_hash: hash(password),
    ip_salt: cur?.ip_salt ?? randomBytes(16).toString('hex'),
    updated_at: new Date().toISOString(),
  })
  if (error) fail('Erreur : ' + error.message)
  const n = await revokeAll()
  console.log(`Mot de passe enregistré en base (haché). ${n} session(s) révoquée(s).`)
  if (!arg) console.log(`Nouveau mot de passe : ${password}`)
} else if (cmd === 'revoquer-tout') {
  console.log(`${await revokeAll()} session(s) révoquée(s).`)
} else if (cmd === 'sessions') {
  const now = new Date().toISOString(), day = new Date(Date.now() - 86_400_000).toISOString()
  const { data: act, error } = await supabase.from('section_sessions').select('created_at,last_seen_at,ip_hash,user_agent').is('revoked_at', null).gt('expires_at', now).order('created_at', { ascending: false })
  if (error) fail('Erreur : ' + error.message)
  const { count: fails } = await supabase.from('section_login_attempts').select('id', { count: 'exact', head: true }).eq('success', false).gte('created_at', day)
  console.log(`Sessions actives : ${act.length} (adresses distinctes : ${new Set(act.map((s) => s.ip_hash)).size})`)
  console.log(`Connexions des dernières 24 h : ${act.filter((s) => s.created_at > day).length} · essais ratés des dernières 24 h : ${fails ?? 0}`)
  for (const s of act.slice(0, 10)) console.log(`  ${s.created_at.slice(0, 16).replace('T', ' ')}  vu ${s.last_seen_at.slice(0, 16).replace('T', ' ')}  ${String(s.ip_hash).slice(0, 8)}  ${String(s.user_agent ?? '').slice(0, 60)}`)
} else {
  fail('Commandes : mot-de-passe [valeur] · sessions · revoquer-tout')
}
