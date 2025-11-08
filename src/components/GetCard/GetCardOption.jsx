import { useMemo, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { useStoreData } from '@/store/storeData'

const GetCardOption = () => {
  const [activeTier, setActiveTier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const packs = useStoreData((state) => state.packs)

  const modalContent = useMemo(() => ({
    basic: {
      title: 'Sobre básico',
      description: packs.basic.description,
      hasCards: packs.basic.cards.length > 0,
    },
    advanced: {
      title: 'Sobre avanzado',
      description: packs.advanced.description,
      hasCards: packs.advanced.cards.length > 0,
    },
    expert: {
      title: 'Sobre experto',
      description: packs.expert.description,
      hasCards: packs.expert.cards.length > 0,
    },
  }), [packs])

  const activeContent = activeTier ? modalContent[activeTier] : null

  const handleOpenTier = (tier) => {
    if (!modalContent[tier]?.hasCards) return
    setActiveTier(tier)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeOnBackdrop={false}
        title={activeContent?.title}
        description={activeContent?.description}
        footer={activeContent ? (
          <div className="flex flex-col gap-2 w-full">
            <Button type="button" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </div>
        ) : null}
      />
      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          onClick={() => handleOpenTier('basic')}
          disabled={!modalContent.basic.hasCards}
        >
          Sobre básico
        </Button>
        <Button
          type="button"
          onClick={() => handleOpenTier('advanced')}
          disabled={!modalContent.advanced.hasCards}
        >
          Sobre avanzado
        </Button>
        <Button
          type="button"
          onClick={() => handleOpenTier('expert')}
          disabled={!modalContent.expert.hasCards}
        >
          Sobre expertos
        </Button>
      </div>
    </>
  )
}

export default GetCardOption