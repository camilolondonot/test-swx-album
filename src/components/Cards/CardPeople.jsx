import { useState, useEffect, useCallback } from 'react'
import { getData } from '@/Services/Api'

const CardPeople = ({ data }) => {
  return (
    <div className="card w-80 max-w-full cursor-default select-none border border-base-300 bg-base-100 text-left opacity-90">
      <div className="card-body space-y-3">
        <span className="badge badge-outline w-fit">Personaje</span>
        <h3 className="text-lg font-semibold leading-tight">{data?.name ?? 'Personaje desconocido'}</h3>
        <dl className="text-sm text-base-content/70 space-y-1">
          <div className="flex justify-between">
            <dt className="font-medium">Género</dt>
            <dd>{data?.gender ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Altura</dt>
            <dd>{data?.height ? `${data.height} cm` : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Masa</dt>
            <dd>{data?.mass ? `${data.mass} kg` : '—'}</dd>
          </div>
        </dl>
        <p className="text-xs uppercase tracking-wide text-base-content/50">Vista previa informativa</p>
      </div>
    </div>
  )
}

export default CardPeople