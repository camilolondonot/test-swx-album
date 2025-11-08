import { useMemo } from 'react'
import { useStoreData } from '@/store/storeData'
import {
  getAlbumSectionMeta,
  getResourceId,
  getResourceUniqueKey,
  isSpecialCard,
} from '@/utils/cards'

const SECTION_TYPES = ['film', 'people', 'starship']

const AlbumContent = () => {
  const albumUser = useStoreData((state) => state.albumUser)
  const completedData = useStoreData((state) => state.completedData)

  const albumMap = useMemo(() => {
    const map = new Map()
    albumUser.forEach((card) => {
      if (card?.uniqueKey) {
        map.set(card.uniqueKey, card)
      }
    })
    return map
  }, [albumUser])

  const sections = useMemo(() => {
    return SECTION_TYPES.map((type) => {
      const meta = getAlbumSectionMeta(type)
      const resources = (completedData ?? [])
        .filter((item) => item.type === type)
        .map((item) => {
          const resourceId = getResourceId(type, item.data)
          return {
            type,
            data: item.data,
            resourceId,
            uniqueKey: getResourceUniqueKey(type, item.data),
          }
        })
        .filter((item) => item.resourceId != null)
        .sort((a, b) => a.resourceId - b.resourceId)
        .slice(0, meta.total)

      const slots = Array.from({ length: meta.total }, (_, index) => {
        const resource = resources[index]
        if (!resource) {
          const placeholderId = index + 1
          return {
            type,
            resourceId: placeholderId,
            isSpecial: isSpecialCard(type, placeholderId),
            collected: false,
            name: 'Espacio disponible',
            uniqueKey: `${type}-${placeholderId}`,
          }
        }

        const collected = albumMap.has(resource.uniqueKey)
        const name = resource.data?.title ?? resource.data?.name ?? 'Lámina sin nombre'

        return {
          type,
          resourceId: resource.resourceId,
          isSpecial: isSpecialCard(type, resource.resourceId),
          collected,
          name,
          uniqueKey: resource.uniqueKey,
        }
      })

      const collectedCount = slots.filter((slot) => slot.collected).length

      return {
        ...meta,
        type,
        slots,
        collectedCount,
      }
    })
  }, [albumMap, completedData])

  const totalCollected = sections.reduce((sum, section) => sum + section.collectedCount, 0)
  const totalAlbum = sections.reduce((sum, section) => sum + section.total, 0)
  const overallProgress = totalAlbum > 0 ? Math.round((totalCollected / totalAlbum) * 100) : 0

  return (
    <div className="space-y-12">
      {albumUser.length === 0 && (
        <div className="rounded-md border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content/70">
          Aún no has agregado láminas a tu álbum. Abre un sobre y selecciona “Agregar al álbum” para empezar a completar tu colección.
        </div>
      )}

      <div className="rounded-lg bg-base-100 p-4 shadow-sm">
        <p className="text-sm text-base-content/70">
          Progreso general: {totalCollected} de {totalAlbum} láminas ({overallProgress}%).
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.type} className="space-y-4">
          <header className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">{section.title}</h2>
            <p className="text-sm text-base-content/70">
              {section.collectedCount} / {section.total} láminas recolectadas
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.slots.map((slot) => (
              <div
                key={slot.uniqueKey}
                className={`rounded-lg border p-4 shadow-sm transition-colors ${
                  slot.collected ? 'border-primary/50 bg-primary/10' : 'border-base-200 bg-base-200/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>#{slot.resourceId ?? '—'}</span>
                  <span
                    className={`badge ${slot.isSpecial ? 'badge-warning' : 'badge-outline'} text-xs`}
                  >
                    {slot.isSpecial ? 'Especial' : 'Regular'}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold">{slot.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-wide text-base-content/60">
                  {slot.collected ? 'En el álbum' : 'Disponible'}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default AlbumContent