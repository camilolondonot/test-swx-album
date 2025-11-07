import { useState, useEffect } from 'react'
import { Button, Carousel, Loading } from '@/components/ui'
import { getData } from '@/Services/Api'
import CardPeople from '@/components/Cards/CardPeople'

const GetCard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetData = async () => {
    setLoading(true)
    try {
      const response = await getData('people')
      setData(response)
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
      {loading && <Loading />}
      {error && (
        <p className="text-error">Ocurrió un problema al cargar la información.</p>
      )}

      {!loading && !error && data?.results?.length > 0 && (
        <div className="py-6">
          <Carousel slidesToShow={Math.min(3, data.results.length)}>
            {data.results.map((item) => (
              <div key={item.url ?? item.name} className="flex justify-center">
                <CardPeople data={item} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <Button type="link" to="/album">Album</Button>
      <Button type="link" to="/">Home</Button>
    </section>
  )
}

export default GetCard