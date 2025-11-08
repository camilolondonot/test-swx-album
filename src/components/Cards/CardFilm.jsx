import { Button } from '@/components/ui'

const CardFilm = ({ data }) => {
  return (
    <div className="card w-80 max-w-full cursor-default select-none border border-base-300 bg-base-100 text-left opacity-90">
      <div className="card-body space-y-3">
        <span className="badge badge-outline w-fit">Película</span>
        <h3 className="text-lg font-semibold leading-tight">{data?.title ?? 'Película desconocida'}</h3>
        <dl className="text-sm text-base-content/70 space-y-1">
          <div className="flex justify-between">
            <dt className="font-medium">Episodio</dt>
            <dd>{data?.episode_id ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Director</dt>
            <dd>{data?.director ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Estreno</dt>
            <dd>{data?.release_date ?? '—'}</dd>
          </div>
        </dl>
        <p className="text-xs uppercase tracking-wide text-base-content/50">Vista previa informativa</p>
      </div>
    </div>
  )
}

export default CardFilm