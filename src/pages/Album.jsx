import { Button } from '@/components/ui'

const Album = () => {
  return (
    <section>
      <h1>Album</h1>
      <Button type="link" to="/get-card">Get Card</Button>
      <Button type="link" to="/">Home</Button>
    </section>
  )
}

export default Album