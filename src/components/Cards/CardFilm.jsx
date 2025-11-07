import { Button } from '@/components/ui'

const CardFilm = ({ data }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm h-full shadow-slate-600/50">
      <figure>
        <img
          src={`https://placehold.co/600x400?text=${data.title}`}
          alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {data.title}
        </h2>
      </div>
      <div className="card-actions justify-end">
        <Button type="link" to={`/film/${data.id}`}>Ver más</Button>
      </div>
    </div>
  )
}

export default CardFilm