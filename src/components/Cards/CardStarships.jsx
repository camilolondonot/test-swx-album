import { Button } from '@/components/ui'

const CardStarships = ({ data }) => {
  return (
    <div className="card w-80 max-w-full cursor-default select-none border border-base-300 bg-base-100 text-left opacity-90">
      <div className="card-body space-y-3">
        <span className="badge badge-outline w-fit">Nave</span>
        <h3 className="text-lg font-semibold leading-tight">{data?.name ?? 'Nave desconocida'}</h3>
        <dl className="text-sm text-base-content/70 space-y-1">
          <div className="flex justify-between">
            <dt className="font-medium">Modelo</dt>
            <dd>{data?.model ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Clase</dt>
            <dd>{data?.starship_class ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Pasajeros</dt>
            <dd>{data?.passengers ?? '—'}</dd>
          </div>
        </dl>
        <p className="text-xs uppercase tracking-wide text-base-content/50">Vista previa informativa</p>
      </div>
    </div>
  )
}

export default CardStarships