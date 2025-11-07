import { useState, useEffect } from 'react'
import { Button, Carousel, Loading, Container } from '@/components/ui'
import { getData } from '@/Services/Api'
import { CardPeople, CardFilm, CardStarships } from '@/components/Cards'

const GetCard = () => {
  const [peopleData, setPeopleData] = useState(null)
  const [filmsData, setFilmsData] = useState(null)
  const [starshipsData, setStarshipsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetData = async () => {
    setLoading(true)
    try {
      const peopleResponse = await getData('people')
      const filmsResponse = await getData('films')
      const starshipsResponse = await getData('starships')
      setPeopleData(peopleResponse)
      setFilmsData(filmsResponse)
      setStarshipsData(starshipsResponse)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <section>
      <h1 className='text-2xl font-bold'>Cartas</h1>
      
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