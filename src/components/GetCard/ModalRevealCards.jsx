import { useMemo } from 'react'
import { Modal, Button } from '@/components/ui'
import { TIER_LABELS } from '@/constants/packs'

const TYPE_TITLES = {
  people: 'Personaje',
  film: 'Película',
  starship: 'Nave',
}

const getCardTitle = (card) => card?.data?.name ?? card?.data?.title ?? 'Sin nombre'

const getCategoryLabel = (card) => (card?.isSpecial ? 'Especial' : 'Regular')

const ModalRevealCards = ({ open, tier, cards, onAssign, onClose }) => {
  const cardsWithFallback = useMemo(() => cards ?? [], [cards])
  const pendingCount = cardsWithFallback.filter((card) => ['pending', 'duplicate'].includes(card.status)).length

  const handleAdd = (card) => {
    if (!tier || card?.status === 'duplicate') return
    onAssign?.(tier, card.id, 'added')
  }

  const handleDiscard = (card) => {
    if (!tier) return
    onAssign?.(tier, card.id, 'discarded')
  }

  const handleClose = () => {
    if (pendingCount > 0) return
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeOnBackdrop={false}
      showCloseButton={pendingCount === 0}
      title={`Contenido del sobre ${tier ? TIER_LABELS[tier] : ''}`.trim()}
      contentClassName="max-w-4xl"
      footer={(
        <div className="w-full flex justify-end">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={pendingCount > 0}>
            Cerrar
          </Button>
        </div>
      )}
    >
      {cardsWithFallback.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-lg font-semibold">No hay cartas disponibles en este sobre.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-base-content/70">
            Cartas pendientes de asignar: {pendingCount} de {cardsWithFallback.length}
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {cardsWithFallback.map((card) => {
              const isPending = card.status === 'pending'
              const isDuplicate = card.status === 'duplicate'
              const canAdd = isPending && !isDuplicate
              const canDiscard = isPending || isDuplicate

              const statusLabel = (() => {
                if (card.status === 'added') return 'Agregada al álbum'
                if (card.status === 'duplicate') return 'Repetida: descarta para continuar'
                if (card.status === 'discarded') return 'Descartada'
                return null
              })()

              return (
                <div key={card.id} className="card bg-base-100 shadow-md border">
                  <div className="card-body space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-base-content/60">
                      <span>#{card.resourceId ?? '—'}</span>
                      <span className="badge badge-outline capitalize">
                        {TYPE_TITLES[card.type] ?? card.type}
                      </span>
                    </div>
                    <h3 className="card-title text-lg leading-tight">{getCardTitle(card)}</h3>
                    <div className="flex flex-col gap-1 text-sm text-base-content/70">
                      <span>
                        Categoría: <strong>{getCategoryLabel(card)}</strong>
                      </span>
                      <span>
                        Sección: <strong>{card.section ?? '—'}</strong>
                      </span>
                    </div>
                    {card.type === 'people' && (
                      <p className="text-sm text-base-content/70">
                        Género: {card.data?.gender ?? 'Desconocido'}
                      </p>
                    )}
                    {card.type === 'film' && (
                      <p className="text-sm text-base-content/70">
                        Director: {card.data?.director ?? 'Desconocido'}
                      </p>
                    )}
                    {card.type === 'starship' && (
                      <p className="text-sm text-base-content/70">
                        Clase: {card.data?.starship_class ?? 'Desconocido'}
                      </p>
                    )}
                    {statusLabel && (
                      <span
                        className={`badge mt-2 ${
                          card.status === 'added'
                            ? 'badge-success'
                            : card.status === 'duplicate'
                              ? 'badge-warning'
                              : card.status === 'discarded'
                                ? 'badge-ghost'
                                : 'badge-outline'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    )}
                    <div className="card-actions justify-end mt-4 gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleDiscard(card)}
                        disabled={!canDiscard}
                      >
                        Descartar
                      </Button>
                      <Button type="button" onClick={() => handleAdd(card)} disabled={!canAdd}>
                        Agregar al álbum
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ModalRevealCards
