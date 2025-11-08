import { Outlet, NavLink } from 'react-router-dom'
import { useStoreData } from '@/store/storeData'
import useCooldownTimer from '@/hooks/useCooldownTimer'
import CooldownBanner from '@/components/Cooldown/CooldownBanner'
import { cn } from '@/utils/index'

const navItems = [
  { to: '/get-card', label: 'Obtener Láminas' },
  { to: '/album', label: 'Mi álbum' },
]

const MainLayout = () => {
  const cooldownEndsAt = useStoreData((state) => state.cooldownEndsAt)
  const clearCooldown = useStoreData((state) => state.clearCooldown)
  const { remainingSeconds, isActive } = useCooldownTimer(cooldownEndsAt, clearCooldown)

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-xl font-bold tracking-wide">
            StarWars Album
          </NavLink>
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: isRouteActive }) => cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  isRouteActive ? 'text-primary' : 'text-base-content/70',
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <CooldownBanner remainingSeconds={remainingSeconds} isActive={isActive} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-base-300 bg-base-100 py-4 text-center text-xs text-base-content/60">
        Datos obtenidos de SWAPI • Proyecto Álbum SWX
      </footer>
    </div>
  )
}

export default MainLayout
