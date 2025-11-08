import { useState, useMemo, useEffect, useRef } from 'react'
import { Button, Modal } from '@/components/ui'
import { useStoreData } from '@/store/storeData'
import { PACK_TIERS, TIER_LABELS } from '@/constants/packs'
import ModalRevealCards from './ModalRevealCards'

const GetCardOption = () => {
  const [selectedTier, setSelectedTier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRevealOpen, setIsRevealOpen] = useState(false)
  const [cooldownEndsAt, setCooldownEndsAt] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const shouldResetTierOnCloseRef = useRef(true)

  const packs = useStoreData((state) => state.packs)
  const assignCardStatus = useStoreData((state) => state.assignCardStatus)
  const albumUser = useStoreData((state) => state.albumUser)

  const modalContent = useMemo(() => {
    return PACK_TIERS.reduce((acc, tier) => {
      acc[tier] = {
        title: `Sobre ${TIER_LABELS[tier]}`,
        description: packs[tier]?.description ?? '',
        hasCards: (packs[tier]?.cards?.length ?? 0) > 0,
        totalCount: packs[tier]?.cards?.length ?? 0,
      }
      return acc
    }, {})
  }, [packs])

  const selectedContent = selectedTier ? modalContent[selectedTier] : null

  const isCooldownActive = remainingSeconds > 0

  useEffect(() => {
    if (!cooldownEndsAt) {
      setRemainingSeconds(0)
      return undefined
    }

    const updateRemaining = () => {
      const diff = Math.ceil((cooldownEndsAt - Date.now()) / 1000)
      if (diff <= 0) {
        setRemainingSeconds(0)
        setCooldownEndsAt(null)
      } else {
        setRemainingSeconds(diff)
      }
    }

    updateRemaining()
    const intervalId = setInterval(updateRemaining, 1000)

    return () => clearInterval(intervalId)
  }, [cooldownEndsAt])

  const handleOpenTier = (tier) => {
    if (isCooldownActive) return
    const content = modalContent[tier]
    if (!content?.hasCards) return
    shouldResetTierOnCloseRef.current = true
    setSelectedTier(tier)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    if (shouldResetTierOnCloseRef.current) {
      setSelectedTier(null)
    }
    shouldResetTierOnCloseRef.current = true
  }

  const handleRevealPack = () => {
    shouldResetTierOnCloseRef.current = false
    setIsModalOpen(false)
    setIsRevealOpen(true)
    const endAt = Date.now() + 60_000
    setCooldownEndsAt(endAt)
    setRemainingSeconds(60)
  }

  const handleCloseReveal = () => {
    setIsRevealOpen(false)
    setSelectedTier(null)
    shouldResetTierOnCloseRef.current = true
  }

  const handleAssignCard = (tier, cardId, status) => {
    assignCardStatus?.(tier, cardId, status)
  }

  const revealCards = useMemo(() => {
    if (!isRevealOpen || !selectedTier) return []
    return packs[selectedTier]?.cards ?? []
  }, [isRevealOpen, selectedTier, packs])

  useEffect(() => {
    if (!isRevealOpen || !selectedTier) {
      return
    }

    const cards = packs[selectedTier]?.cards ?? []
    const albumKeys = new Set(
      (albumUser ?? [])
        .map((card) => card?.uniqueKey)
        .filter(Boolean),
    )

    cards
      .filter((card) => card.status === 'pending' && card.uniqueKey && albumKeys.has(card.uniqueKey))
      .forEach((card) => {
        assignCardStatus?.(selectedTier, card.id, 'duplicate')
      })
  }, [isRevealOpen, selectedTier, packs, albumUser, assignCardStatus])

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={selectedContent?.title}
        description={selectedContent?.description}
        footer={
          selectedContent && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
              <Button onClick={handleRevealPack}>Abrir sobre</Button>
            </div>
          )
        }
      >
        {selectedContent && (
          <p className="mt-2 text-sm">
            Este sobre contiene {selectedContent.totalCount} cartas.
          </p>
        )}
      </Modal>

      <ModalRevealCards
        open={isRevealOpen}
        tier={selectedTier}
        cards={revealCards}
        onAssign={handleAssignCard}
        onClose={handleCloseReveal}
      />

      {isCooldownActive && (
        <p className="text-center text-sm text-yellow-500 mt-2">
          Podrás abrir otro sobre en {remainingSeconds}s.
        </p>
      )}

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {PACK_TIERS.map((tier) => (
          <Button
            key={tier}
            onClick={() => handleOpenTier(tier)}
            disabled={isCooldownActive}
          >
            Sobre {TIER_LABELS[tier]}
          </Button>
        ))}
      </div>
    </>
  )
}

export default GetCardOption
