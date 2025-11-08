import { useMemo, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { useStoreData } from '@/store/storeData'
import ModalRevealCards from './ModalRevealCards'

const TIER_LABELS = {
  basic: 'básico',
  advanced: 'avanzado',
  expert: 'experto',
}

const GetCardOption = () => {
  const [activeTier, setActiveTier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRevealOpen, setIsRevealOpen] = useState(false)

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

  const handleRevealPack = () => {
    if (!activeTier) return
    setIsModalOpen(false)
    setIsRevealOpen(true)
  }

  const handleCloseReveal = () => {
    setIsRevealOpen(false)
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
          <div className="flex w-full justify-between gap-2 flex-col sm:flex-row">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleRevealPack}>
              Abrir sobre
            </Button>
          </div>
        ) : null}
      />
      <ModalRevealCards
        open={isRevealOpen}
        cards={activeTier ? packs[activeTier].cards : []}
        tierLabel={activeTier ? TIER_LABELS[activeTier] : undefined}
        onClose={handleCloseReveal}
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