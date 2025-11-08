import { useEffect, useMemo, useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { useStoreData } from '@/store/storeData'

const TYPE_TITLES = {
  people: 'Personaje',
  film: 'Película',
  starship: 'Nave',
}

const getCardTitle = (card) => card?.data?.name ?? card?.data?.title ?? 'Sin nombre'

const ModalRevealCards = ({ open, cards, tierLabel, onClose }) => {
  const addCardToAlbum = useStoreData((state) => state.addCardToAlbum)
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    if (open) {
      setVisibleCards(cards ?? [])
    }
  }, [open, cards])

  const remainingCount = useMemo(() => visibleCards.length, [visibleCards])

  const handleAdd = (card) => {
    addCardToAlbum({
      ...card,
      acquiredAt: new Date().toISOString(),
    })
    setVisibleCards((prev) => prev.filter((item) => item !== card))
  }

  const handleDiscard = (card) => {
    setVisibleCards((prev) => prev.filter((item) => item !== card))
  }

  const handleClose = () => {
    setVisibleCards([])
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Contenido del sobre ${tierLabel ?? ''}`.trim()}
      closeOnBackdrop={false}
      contentClassName="max-w-4xl"
      footer={(
        <div className="w-full flex justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      )}
    >
      {remainingCount === 0 ? (
        <div className="text-center py-6">
          <p className="text-lg font-semibold">¡Sobre completado!</p>
          <p className="text-sm text-base-content/70">
            Ya gestionaste todas las cartas de este sobre.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {visibleCards.map((card) => (
            <div key={`${card.type}-${getCardTitle(card)}`} className="card bg-base-100 shadow-md border">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <span className="badge badge-outline capitalize">{TYPE_TITLES[card.type] ?? card.type}</span>
                  <span className="text-xs text-base-content/60">Sobre: {tierLabel}</span>
                </div>
                <h3 className="card-title text-lg">{getCardTitle(card)}</h3>
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
                <div className="card-actions justify-end mt-4 gap-2">
                  <Button type="button" variant="secondary" onClick={() => handleDiscard(card)}>
                    Descartar
                  </Button>
                  <Button type="button" onClick={() => handleAdd(card)}>
                    Agregar al álbum
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default ModalRevealCards