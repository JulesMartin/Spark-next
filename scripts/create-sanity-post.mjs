#!/usr/bin/env node
// Usage: echo '<json>' | node scripts/create-sanity-post.mjs
// Or:    node scripts/create-sanity-post.mjs '<json>'

import { readFileSync } from 'fs'
import { join } from 'path'

function loadEnvFile(path) {
  try {
    const content = readFileSync(path, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      let value = trimmed.slice(eqIdx + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (key && !process.env[key]) process.env[key] = value
    }
  } catch {}
}

loadEnvFile(join(process.cwd(), '.env.local'))
loadEnvFile(join(process.cwd(), '.env'))

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'u7ptqvl2'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('Erreur : SANITY_API_TOKEN manquant dans .env.local')
  process.exit(1)
}

let input = ''
if (process.argv[2]) {
  input = process.argv[2]
} else {
  const chunks = []
  for await (const chunk of process.stdin) chunks.push(chunk)
  input = Buffer.concat(chunks).toString()
}

let post
try {
  post = JSON.parse(input.trim())
} catch (e) {
  console.error('Erreur : JSON invalide en entrée')
  console.error(e.message)
  process.exit(1)
}

function getYouTubeId(url) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

const videoId = getYouTubeId(post.youtubeUrl)
const coverImageUrl = videoId
  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  : null

// Vérifier les doublons de slug
const checkUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=*[_type%3D%3D"post"%26%26slug.current%3D%3D"${encodeURIComponent(post.slug)}"][0]._id`
const checkRes = await fetch(checkUrl, {
  headers: { Authorization: `Bearer ${TOKEN}` },
})
const checkData = await checkRes.json()

if (checkData.result) {
  console.error(`Erreur : un post avec le slug "${post.slug}" existe déjà (ID: ${checkData.result})`)
  process.exit(1)
}

// Créer le document draft
const doc = {
  _type: 'post',
  title: post.title,
  slug: { _type: 'slug', current: post.slug },
  excerpt: post.excerpt || '',
  body: post.body || '',
  tags: Array.isArray(post.tags) ? post.tags : [],
  youtubeUrl: post.youtubeUrl || null,
  coverImageUrl: coverImageUrl,
  publishedAt: new Date().toISOString(),
  status: 'draft',
}

const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}?returnIds=true`
const res = await fetch(mutateUrl, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ mutations: [{ create: doc }] }),
})

const data = await res.json()

if (!res.ok) {
  console.error('Erreur Sanity :')
  console.error(JSON.stringify(data, null, 2))
  process.exit(1)
}

const docId = data.results?.[0]?.id
console.log(`\n✓ Draft créé dans Sanity`)
console.log(`  Titre   : ${post.title}`)
console.log(`  Slug    : ${post.slug}`)
console.log(`  ID      : ${docId}`)
console.log(`  Studio  : http://localhost:3000/studio/structure/post;${docId}\n`)
