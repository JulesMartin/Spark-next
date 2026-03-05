'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Supabase n\'est pas encore configuré. Ajoutez vos variables d\'environnement.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <span className="font-display text-3xl font-black text-cream">Spark</span>
          <p className="font-body text-muted text-sm mt-2">Dashboard admin</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block font-body text-xs uppercase tracking-wider text-muted mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-surface border border-edge focus:border-accent text-cream font-body text-sm px-4 py-3 outline-none transition-colors placeholder:text-muted/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-body text-xs uppercase tracking-wider text-muted mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-surface border border-edge focus:border-accent text-cream font-body text-sm px-4 py-3 outline-none transition-colors placeholder:text-muted/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-accent hover:bg-accent-light text-bg font-body font-medium text-sm uppercase tracking-wider py-3 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="font-body text-xs text-muted text-center mt-8">
          Accès restreint aux administrateurs.
        </p>
      </div>
    </div>
  )
}
