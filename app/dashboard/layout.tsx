import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-edge flex flex-col bg-bg">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-edge">
          <Link href="/" className="font-display text-xl font-black text-cream hover:text-accent transition-colors">
            Spark
          </Link>
          <p className="font-body text-xs text-muted mt-0.5">Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <SidebarLink href="/dashboard" label="Contenus" icon="▤" />
          <SidebarLink href="/dashboard/new" label="Nouveau contenu" icon="+" />
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-edge">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-cream hover:bg-surface transition-colors"
    >
      <span className="text-accent font-mono text-base w-4">{icon}</span>
      {label}
    </Link>
  )
}

function LogoutButton() {
  return (
    <form action="/api/auth/signout" method="post">
      <button
        type="submit"
        className="w-full flex items-center gap-3 px-3 py-2 font-body text-sm text-muted hover:text-cream hover:bg-surface transition-colors text-left"
      >
        <span className="text-muted font-mono text-base w-4">↩</span>
        Se déconnecter
      </button>
    </form>
  )
}
