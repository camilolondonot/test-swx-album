import { Button, Container } from '@/components/ui'
import AlbumContent from '@/components/Album/AlbumContent'

const Album = () => {
  return (
    <section>
      <Container>
        <h1>Album</h1>
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