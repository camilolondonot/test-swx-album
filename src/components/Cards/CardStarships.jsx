import { Button } from '@/components/ui'

const CardStarships = ({ data }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="card bg-base-100 w-96 shadow-sm h-full shadow-slate-600/50">
        <figure>
          <img
            src={`https://placehold.co/600x400?text=${data.name}`}
            alt="Shoes" />
        </figure>
      </div>
      <div className="card-body">
        <h2 className="card-title">
          {data.name}
        </h2>
      </div>
      <div className="card-actions justify-end">
        <Button type="link" to={`/starship/${data.id}`}>Ver más</Button>
      </div>
    </div>
  )
}

export default CardStarships