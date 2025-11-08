import { useState, useMemo, useEffect, useRef } from 'react'
import { Button, Modal } from '@/components/ui'
import { useStoreData } from '@/store/storeData'
import { PACK_TIERS, TIER_LABELS } from '@/constants/packs'
import useCooldownTimer from '@/hooks/useCooldownTimer'
import CooldownBanner from '@/components/Cooldown/CooldownBanner'
import ModalRevealCards from './ModalRevealCards'

const COOLDOWN_DURATION_MS = 60_000

const GetCardOption = () => {
  const [selectedTier, setSelectedTier] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRevealOpen, setIsRevealOpen] = useState(false)
  const [isOpeningPack, setIsOpeningPack] = useState(false)
  const shouldResetTierOnCloseRef = useRef(true)

  const packs = useStoreData((state) => state.packs)
  const assignCardStatus = useStoreData((state) => state.assignCardStatus)
  const albumUser = useStoreData((state) => state.albumUser)
  const cooldownEndsAt = useStoreData((state) => state.cooldownEndsAt)
  const startCooldown = useStoreData((state) => state.startCooldown)
  const clearCooldown = useStoreData((state) => state.clearCooldown)
  const openPack = useStoreData((state) => state.openPack)

  const { remainingSeconds, isActive: isCooldownActive } = useCooldownTimer(cooldownEndsAt, clearCooldown)

  const modalContent = useMemo(() => {
    return PACK_TIERS.reduce((acc, tier) => {
      acc[tier] = {
        title: `Sobre ${TIER_LABELS[tier]}`,
        compositionLabel: packs[tier]?.compositionLabel,
        description: packs[tier]?.compositionLabel ?? 'Genera láminas al abrir el sobre.',
        hasCards: (packs[tier]?.cards?.length ?? 0) > 0,
        totalCount: packs[tier]?.cards?.length ?? 0,
      }
      return acc
    }, {})
  }, [packs])

  const selectedContent = selectedTier ? modalContent[selectedTier] : null

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

  const handleOpenTier = (tier) => {
    if (isCooldownActive) return
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

  const handleRevealPack = async () => {
    if (!selectedTier || isOpeningPack) return

    shouldResetTierOnCloseRef.current = false
    setIsOpeningPack(true)
    try {
      await openPack?.(selectedTier)
      setIsModalOpen(false)
      setIsRevealOpen(true)
      startCooldown?.(COOLDOWN_DURATION_MS)
    } catch (error) {
      console.error('No fue posible abrir el sobre', error)
      setIsModalOpen(false)
      setSelectedTier(null)
    } finally {
      setIsOpeningPack(false)
    }
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
              <Button variant="secondary" onClick={handleCloseModal} disabled={isOpeningPack}>Cancelar</Button>
              <Button onClick={handleRevealPack} disabled={isOpeningPack}>
                {isOpeningPack ? 'Abriendo…' : 'Abrir sobre'}
              </Button>
            </div>
          )
        }
      >
        {selectedContent && (
          <p className="mt-2 text-sm">
            {selectedContent.compositionLabel ?? 'Configura este sobre aleatoriamente.'}
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

      <CooldownBanner
        remainingSeconds={remainingSeconds}
        isActive={isCooldownActive}
        className="mt-2"
      />

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
