import { useState, useEffect, useCallback } from 'react'
import { getData } from '@/Services/Api'

const CardPeople = ({ data }) => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getVehicleId = (url) => {
    if (!url) return null
    const segments = url.split('/').filter(Boolean)
    return segments.pop() ?? null
  }

  const fetchVehicles = useCallback(async () => {
    if (!Array.isArray(data?.vehicles) || data.vehicles.length === 0) {
      setVehicles([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const requests = data.vehicles
        .map((url) => {
          const id = getVehicleId(url)
          return id ? getData('vehicles', id) : null
        })
        .filter(Boolean)

      const responses = await Promise.all(requests)
      setVehicles(responses)
    } catch (err) {
      setError(err)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }, [data?.vehicles])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  return (
    <div className="card bg-base-100 w-96 shadow-sm h-full shadow-slate-600/50">
      <figure>
        <img
          src={`https://placehold.co/600x400?text=${data.name}`}
          alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {data.name}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        {loading && <p className="text-sm text-neutral">Cargando vehículos…</p>}
        {error && <p className="text-sm text-error">No se pudieron cargar los vehículos.</p>}
        {!loading && !error && (
          <div className="card-actions justify-end flex-wrap gap-2">
            {vehicles.length > 0 ? (
              vehicles.map((item) => (
                <div key={item.url ?? `${item.name}-${item.model}`} className="badge badge-outline">
                  {item.name} - {item.vehicle_class}
                </div>
              ))
            ) : (
              <span className="badge badge-outline">Sin vehículos</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardPeople