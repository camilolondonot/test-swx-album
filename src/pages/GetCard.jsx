import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreData } from '@/store/storeData'
import { getAllData } from '@/Services/Api'
import { Button, Carousel, Loading, Container } from '@/components/ui'
import { CardPeople, CardFilm, CardStarships } from '@/components/Cards'

import GetCardOption from '@/components/GetCard/GetCardOption'

const GetCard = () => {
  const [peopleData, setPeopleData] = useState(null)
  const [filmsData, setFilmsData] = useState(null)
  const [starshipsData, setStarshipsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const completedData = useStoreData((state) => state.completedData)
  const setCompletedData = useStoreData((state) => state.setCompletedData)
  const catalogLoaded = useStoreData((state) => state.catalogLoaded)

  const fetchCatalog = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [peopleResponse, filmsResponse, starshipsResponse] = await Promise.all([
        getAllData('people'),
        getAllData('films'),
        getAllData('starships'),
      ])

      setPeopleData(peopleResponse)
      setFilmsData(filmsResponse)
      setStarshipsData(starshipsResponse)

      setCompletedData([
        ...(peopleResponse?.results?.map((item) => ({
          type: 'people',
          data: item,
        })) ?? []),
        ...(filmsResponse?.results?.map((item) => ({
          type: 'film',
          data: item,
        })) ?? []),
        ...(starshipsResponse?.results?.map((item) => ({
          type: 'starship',
          data: item,
        })) ?? []),
      ])
    } catch (err) {
      console.error('Error al obtener datos del catálogo', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [setCompletedData])

  useEffect(() => {
    if (catalogLoaded) return
    fetchCatalog()
  }, [catalogLoaded, fetchCatalog])

  const hasCatalog = catalogLoaded && Array.isArray(completedData) && completedData.length > 0

  const sections = useMemo(() => ([
    {
      title: 'Personajes',
      data: peopleData?.results ?? [],
      CardComponent: CardPeople,
      keyAccessor: (item) => item.url ?? item.name,
    },
    {
      title: 'Películas',
      data: filmsData?.results ?? [],
      CardComponent: CardFilm,
      keyAccessor: (item) => item.url ?? item.title,
    },
    {
      title: 'Naves',
      data: starshipsData?.results ?? [],
      CardComponent: CardStarships,
      keyAccessor: (item) => item.url ?? item.name,
    },
  ]), [peopleData, filmsData, starshipsData])

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Obtener láminas</h1>
        <p className="text-base text-base-content/70">
          Abre sobres para descubrir láminas nuevas, agrégalas a tu álbum o descarta las que estén repetidas.
        </p>
      </header>

      <Container>
        <GetCardOption />
      </Container>

      <Container>
        {loading && (
          <div className="py-6">
            <Loading />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error-content">
            <p>Ocurrió un problema al cargar el catálogo de láminas.</p>
            <Button className="mt-3" variant="secondary" onClick={fetchCatalog}>
              Reintentar
            </Button>
          </div>
        )}

        {hasCatalog && !loading && !error && (
          <p className="text-sm text-base-content/70">
            Catálogo disponible: {completedData.length} láminas listas para aparecer en tus sobres.
          </p>
        )}
      </Container>

      {hasCatalog && sections.map((section) => {
        if (section.data.length === 0) {
          return null
        }

        const slidesToShow = Math.min(3, section.data.length)

        return (
          <div key={section.title} className="space-y-4">
            <Container>
              <h2 className="text-2xl font-semibold">{section.title}</h2>
            </Container>
            <div className="py-6">
              <Carousel slidesToShow={slidesToShow}>
                {section.data.map((item) => {
                  const key = section.keyAccessor(item)
                  const CardComponent = section.CardComponent
                  return (
                    <div key={key} className="flex justify-center">
                      <CardComponent data={item} />
                    </div>
                  )
                })}
              </Carousel>
            </div>
          </div>
        )
      })}

      {!loading && !error && !hasCatalog && (
        <div className="rounded-md border border-base-300 bg-base-100 px-4 py-6 text-center text-sm text-base-content/70">
          Estamos preparando el catálogo de láminas. Reintenta en unos segundos si el listado no aparece automáticamente.
        </div>
      )}
    </section>
  )
}

export default GetCard