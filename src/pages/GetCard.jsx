import { useEffect, useState } from 'react'
import { useStoreData } from '@/store/storeData'
import { Button, Carousel, Loading, Container } from '@/components/ui'
import { getData } from '@/Services/Api'
import { CardPeople, CardFilm, CardStarships } from '@/components/Cards'
import GetCardOption from '@/components/GetCard/GetCardOption'

const GetCard = () => {
  const [peopleData, setPeopleData] = useState(null)
  const [filmsData, setFilmsData] = useState(null)
  const [starshipsData, setStarshipsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const completedData = useStoreData((state) => state.completedData)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      setLoading(true)
      try {
        const [peopleResponse, filmsResponse, starshipsResponse] = await Promise.all([
          getData('people'),
          getData('films'),
          getData('starships'),
        ])

        if (cancelled) return

        setPeopleData(peopleResponse)
        setFilmsData(filmsResponse)
        setStarshipsData(starshipsResponse)

        useStoreData.getState().setCompletedData([
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
        if (cancelled) return
        setError(err)
        useStoreData.getState().setCompletedData([])
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    console.log('completedData', completedData)
  }, [completedData])

  return (
    <section>
      <h1 className='text-2xl font-bold'>Cartas</h1>
      <Container>
        <GetCardOption />
      </Container>
      
      {loading && <Loading />}
      {error && (
        <p className="text-error">Ocurrió un problema al cargar la información.</p>
      )}
      {!loading && !error && (
        <p className="text-sm text-base-content/70">
          Total de cartas disponibles: {completedData.length}
        </p>
      )}

      <Container >
        <h2 className='text-7xl font-bold'>Personajes</h2>
      </Container>

      <div className="py-6">
        <Carousel slidesToShow={Math.min(3, peopleData?.results?.length)}>
        {peopleData?.results?.map((item) => (
          <div key={item.url ?? item.name} className="flex justify-center">
            <CardPeople data={item} />
          </div>
          ))}
        </Carousel>
      </div>

      <Container >
        <h2 className='text-7xl font-bold'>Peliculas</h2>
      </Container>

      <div className="py-6">
        <Carousel slidesToShow={Math.min(3, filmsData?.results?.length)}>
        {filmsData?.results?.map((item) => (
          <div key={item.url ?? item.title} className="flex justify-center">
            <CardFilm data={item} />
          </div>
          ))}
        </Carousel>
      </div>

      <Container >
        <h2 className='text-7xl font-bold'>Naves</h2>
      </Container>

      <div className="py-6">
        <Carousel slidesToShow={Math.min(3, starshipsData?.results?.length)}>
          {starshipsData?.results?.map((item) => (
            <div key={item.url ?? item.name} className="flex justify-center">
              <CardStarships data={item} />
            </div>
          ))}
        </Carousel>
      </div>


      <Button type="link" to="/album">Album</Button>
      <Button type="link" to="/">Home</Button>
    </section>
  )
}

export default GetCard