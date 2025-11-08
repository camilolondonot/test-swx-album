import { useStoreData } from '@/store/storeData'
import { CardPeople, CardFilm, CardStarships } from '@/components/Cards'

const AlbumContent = () => {
  const albumUser = useStoreData((state) => state.albumUser)

  console.log('albumUser', albumUser)

  return (
    <div>
      {albumUser.map((card) => (
        <div key={card.id}>
          {card.type === 'people' && <CardPeople data={card.data} />}
          {card.type === 'film' && <CardFilm data={card.data} />}
          {card.type === 'starship' && <CardStarships data={card.data} />}
        </div>
      ))}
    </div>
  )
}

export default AlbumContent