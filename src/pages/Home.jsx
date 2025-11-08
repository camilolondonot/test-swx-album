import { Link } from 'react-router-dom'
import { Button, Container } from '@/components/ui'

const Home = () => {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-base-200 via-base-100 to-base-200 opacity-70" />
      <Container>
        <div className="flex flex-col items-center justify-center gap-8 py-16 text-center md:py-24">
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Proyecto Álbum SWX</p>
            <h1 className="text-4xl font-extrabold leading-tight text-base-content md:text-5xl">
              Completa tu álbum digital del universo Star Wars
            </h1>
            <p className="text-base text-base-content/70 md:text-lg">
              Abre sobres, colecciona láminas únicas de personajes, películas y naves, y construye tu propia enciclopedia galáctica.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Button type="link" to="/get-card" className="w-full sm:w-auto">
              Obtener láminas
            </Button>
            <Button type="link" variant="secondary" to="/album" className="w-full sm:w-auto">
              Ver mi álbum
            </Button>
          </div>

          <div className="mt-12 grid gap-4 text-sm text-base-content/60 sm:grid-cols-3">
            <div className="rounded-lg border border-base-300 bg-base-100/70 p-4">
              <p className="font-semibold text-base-content">3 Secciones</p>
              <p>Películas, personajes y naves listas para descubrir.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100/70 p-4">
              <p className="font-semibold text-base-content">Láminas especiales</p>
              <p>Busca las cartas marcadas como especiales para completar la colección.</p>
            </div>
            <div className="rounded-lg border border-base-300 bg-base-100/70 p-4">
              <p className="font-semibold text-base-content">Actualizado en tiempo real</p>
              <p>Los sobres se generan desde la API oficial de Star Wars.</p>
            </div>
          </div>

          <Link to="https://swapi.dev/" target="_blank" rel="noreferrer" className="text-xs text-base-content/50 underline">
            Datos obtenidos a través de SWAPI
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default Home