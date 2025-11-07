import { Button } from '@/components/ui'

const GetCard = () => {
  return (
    <section>
      <h1>Get Card</h1>
      <Button type="link" to="/album">Album</Button>
      <Button type="link" to="/">Home</Button>
    </section>
  )
}

export default GetCard