import AlbumContent from '@/components/Album/AlbumContent'

const Album = () => {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Mi álbum</h1>
        <p className="mt-2 text-sm text-base-content/70">
          Administra las láminas obtenidas y revisa tu progreso en cada sección.
        </p>
      </header>
      <AlbumContent />
    </section>
  )
}

export default Album