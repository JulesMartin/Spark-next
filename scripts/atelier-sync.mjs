// Envoie le contenu de l'espace membres vers le bucket privé Supabase « atelier ».
// Usage : node --env-file=.env.local scripts/atelier-sync.mjs
// Les fichiers ne sont JAMAIS dans le dépôt Git (public) : ils vivent dans presentation-skool/.
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, readFileSync, statSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, extname } from 'node:path'

const SRC = process.env.ATELIER_SRC ?? '/Users/julesmartin/Desktop/presentation-skool'
const BUCKET = 'atelier'
const SKIP = new Set(['.DS_Store', 'modele-document.html'])
const SKILLS = ['guide-demarrage', 'creation-animation', 'copier-montage', 'watch']

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

const tmp = mkdtempSync(join(tmpdir(), 'atelier-'))
const files = [] // { local, key }

// 1. Accueil (hub) à la racine du bucket
files.push({ local: join(SRC, 'hub/index.html'), key: 'index.html' })

// 2. Contenu de video-1 (sans les skills : ils passent par les zips)
for (const p of walk(join(SRC, 'video-1'), ['skills'])) {
  files.push({ local: p, key: 'video-1/' + relative(join(SRC, 'video-1'), p) })
}

// 3. Zips à télécharger
const zip = (name, cwd, folder, extra = []) => {
  const out = join(tmp, name)
  execFileSync('zip', ['-r', '-q', out, folder, '-x', '*/.DS_Store', '*/modele-document.html', ...extra], { cwd })
  files.push({ local: out, key: 'telechargements/' + name })
}
// Le dossier s'appelle « atelier » une fois dézippé (pas « video-1 »)
cpSync(join(SRC, 'video-1'), join(tmp, 'stage/atelier'), { recursive: true })
zip('atelier-complet.zip', join(tmp, 'stage'), 'atelier')
for (const s of SKILLS) zip(`skill-${s}.zip`, join(SRC, 'video-1/skills'), s)
zip('images-structure-30s.zip', join(SRC, 'video-1/images'), 'structure-30s')

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
rmSync(tmp, { recursive: true, force: true })
