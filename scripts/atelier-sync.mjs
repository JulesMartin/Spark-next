// Envoie le contenu de l'espace membres vers le bucket privé Supabase « atelier ».
// Usage (depuis spark-next) : node --env-file=.env.local scripts/atelier-sync.mjs
// Les fichiers ne sont JAMAIS dans le dépôt Git (public) : ils vivent dans presentation-skool/.
// Le script prépare d'abord les zips de chaque vidéo (preparer-classroom.sh), envoie tout,
// puis supprime du bucket les fichiers qui n'existent plus en local.
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const SRC = process.env.ATELIER_SRC ?? '/Users/julesmartin/Desktop/presentation-skool'
const BUCKET = 'atelier'
const SKIP = new Set(['.DS_Store', 'modele-document.html'])

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.zip': 'application/zip',
}

function walk(dir, skipTop = []) {
  const out = []
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name) || skipTop.includes(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

const files = [] // { local, key }

// 1. Accueil (hub) à la racine du bucket
files.push({ local: join(SRC, 'hub/index.html'), key: 'index.html' })

// 2. Chaque vidéo qui contient des fichiers
const videos = readdirSync(SRC).filter((d) => /^video-\d+$/.test(d) && readdirSync(join(SRC, d)).length > 0)
for (const v of videos) {
  // Pages, images et documents (sans skills : ils passent par les zips)
  for (const p of walk(join(SRC, v), ['skills'])) {
    files.push({ local: p, key: `${v}/` + relative(join(SRC, v), p) })
  }
  // Zips préparés pour le Classroom
  execFileSync('bash', [join(SRC, 'preparer-classroom.sh'), v], { stdio: 'ignore' })
  const dir = join(SRC, 'classroom', v, 'fichiers-a-telecharger')
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.zip'))) {
    files.push({ local: join(dir, name), key: `telechargements/${v}/${name}` })
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const { data: buckets } = await supabase.storage.listBuckets()
if (!buckets.some((b) => b.name === BUCKET)) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: false })
  if (error) throw error
  console.log('Bucket privé créé :', BUCKET)
}

let n = 0
for (const f of files) {
  const { error } = await supabase.storage.from(BUCKET).upload(f.key, readFileSync(f.local), {
    upsert: true,
    contentType: TYPES[extname(f.key).toLowerCase()] ?? 'application/octet-stream',
  })
  if (error) { console.error('ÉCHEC', f.key, error.message); process.exitCode = 1 } else n++
}
console.log(`${n}/${files.length} fichiers envoyés`)

// 3. Nettoyage : retire du bucket ce qui n'existe plus en local
async function listAll(prefix = '') {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 })
  if (error) throw error
  const out = []
  for (const e of data) {
    const path = prefix ? `${prefix}/${e.name}` : e.name
    if (e.id === null) out.push(...(await listAll(path))) // dossier
    else out.push(path)
  }
  return out
}
if (process.exitCode !== 1) {
  const keep = new Set(files.map((f) => f.key))
  const stale = (await listAll()).filter((k) => !keep.has(k))
  if (stale.length) {
    const { error } = await supabase.storage.from(BUCKET).remove(stale)
    if (error) console.error('Nettoyage impossible :', error.message)
    else console.log('Supprimés du bucket :', stale.join(', '))
  }
}
