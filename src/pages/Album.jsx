import { Button, Container } from '@/components/ui'
import { useStoreData } from '@/store/storeData'
import useCooldownTimer from '@/hooks/useCooldownTimer'
import CooldownBanner from '@/components/Cooldown/CooldownBanner'
import AlbumContent from '@/components/Album/AlbumContent'

const Album = () => {
  const cooldownEndsAt = useStoreData((state) => state.cooldownEndsAt)
  const clearCooldown = useStoreData((state) => state.clearCooldown)
  const { remainingSeconds, isActive } = useCooldownTimer(cooldownEndsAt, clearCooldown)

  return (
    <section>
      <Container>
        <h1>Album</h1>
        <CooldownBanner
          remainingSeconds={remainingSeconds}
          isActive={isActive}
          className="mt-2"
        />
      </Container>
      <Container>
        <AlbumContent />
      </Container>

      <Button type="link" to="/get-card">Get Card</Button>
      <Button type="link" to="/">Home</Button>
    </section>
  )
}

export default Album