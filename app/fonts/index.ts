import localFont from 'next/font/local'

// Polices hébergées dans le dépôt (fichiers variables, sous-ensemble latin) au lieu de
// next/font/google. Google renvoie parfois à Vercel des adresses /l/font?kit=…&skey=…&v=…,
// et Turbopack refuse ces `&` (« next/font/google queries have exactly one entry ») :
// le build échouait au hasard, sur n'importe quelle police, sans aucun changement de code.
// Déjà arrivé sur DM Sans (29/09/2026) puis sur Raleway (02/11/2026).

export const fraunces = localFont({
  src: [
    { path: './fraunces-latin.woff2', weight: '300 900', style: 'normal' },
    { path: './fraunces-italic-latin.woff2', weight: '300 900', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

export const dmSans = localFont({
  src: './dm-sans-latin.woff2',
  weight: '300 500',
  variable: '--font-dm-sans',
  display: 'swap',
})

export const raleway = localFont({
  src: './raleway-latin.woff2',
  weight: '700 900',
  variable: '--font-raleway',
  display: 'swap',
})

export const assistant = localFont({
  src: './assistant-latin.woff2',
  weight: '400 600',
  variable: '--font-assistant',
  display: 'swap',
})
