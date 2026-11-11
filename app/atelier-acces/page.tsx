import type { Metadata } from 'next'
import { safeNext } from '@/lib/atelier-access'

export const metadata: Metadata = {
  title: 'Accès membres',
  robots: { index: false, follow: false },
}

export default async function AtelierAccesPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; next?: string }>
}) {
  const { erreur, next } = await searchParams

  return (
    <main className="atelier-acces">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&family=Montserrat:wght@500;600;700&display=swap"
      />
      <style>{`
        .atelier-acces{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px;overflow:hidden;
          background:#FDF6FF;color:#15110E;font-family:'Albert Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .atelier-acces .blob{position:absolute;pointer-events:none}
        .atelier-acces .blob b{display:block;width:100%;height:100%;border-radius:58% 42% 55% 45%/50% 56% 44% 50%;
          background:radial-gradient(closest-side,rgba(176,140,236,.95),rgba(190,160,240,.5) 55%,rgba(200,175,245,0) 100%);
          filter:blur(22px);animation:aa-drift 14s ease-in-out infinite alternate}
        @keyframes aa-drift{0%{transform:translate(0,0) rotate(0) scale(1)}100%{transform:translate(34px,-28px) rotate(24deg) scale(1.08)}}
        @media (prefers-reduced-motion:reduce){.atelier-acces .blob b{animation:none}}
        .atelier-acces .card{position:relative;z-index:1;width:100%;max-width:440px;background:rgba(255,255,255,.82);backdrop-filter:blur(8px);
          border-top:1px solid #15110E;border-radius:0 0 18px 18px;padding:32px 30px 30px;box-shadow:0 8px 40px rgba(75,19,105,.14)}
        .atelier-acces h1{font-family:'Montserrat',system-ui,sans-serif;font-weight:600;letter-spacing:-.035em;line-height:1.1;font-size:30px;margin:0 0 10px}
        .atelier-acces p{margin:0 0 20px;color:#5a4d63;font-size:16px;line-height:1.5}
        .atelier-acces label{display:block;font-weight:600;font-size:14px;margin-bottom:6px}
        .atelier-acces input[type=password]{width:100%;font:500 17px 'Albert Sans',system-ui,sans-serif;padding:13px 14px;border:1px solid #D6C2F5;border-radius:10px;background:#fff;color:#15110E}
        .atelier-acces input[type=password]:focus{outline:2px solid #8752B8;outline-offset:1px}
        .atelier-acces button{margin-top:14px;width:100%;font:600 16px 'Albert Sans',system-ui,sans-serif;padding:13px 16px;border:0;border-radius:30px;background:#4B1369;color:#fff;cursor:pointer;transition:background .2s}
        .atelier-acces button:hover{background:#8752B8}
        .atelier-acces .err{background:#fdecec;border-left:4px solid #E5484D;border-radius:0 10px 10px 0;padding:10px 14px;margin:0 0 16px;color:#8c1d20;font-size:15px}
        .atelier-acces small{display:block;margin-top:16px;color:#5a4d63;font-size:14px;line-height:1.45}
      `}</style>

      <i className="blob" style={{ width: 520, height: 520, right: -140, top: -170 }}>
        <b />
      </i>
      <i className="blob" style={{ width: 420, height: 420, left: -150, bottom: -170 }}>
        <b />
      </i>

      <div className="card">
        <h1>Espace membres</h1>
        <p>Entre le mot de passe donné dans le Classroom de la communauté pour accéder à la présentation, aux documents, aux skills et aux images.</p>

        {erreur && <div className="err" role="alert">Mot de passe incorrect. Recopie-le exactement, sans espace en trop.</div>}

        <form method="POST" action="/api/atelier/login">
          <input type="hidden" name="next" value={safeNext(next)} />
          <label htmlFor="password">Mot de passe</label>
          <input id="password" name="password" type="password" autoComplete="current-password" autoFocus required />
          <button type="submit">Entrer</button>
        </form>

        <small>Tu ne trouves pas le mot de passe ? Il est dans le Classroom de la communauté, dans la leçon « Accès à l'atelier ».</small>
      </div>
    </main>
  )
}
