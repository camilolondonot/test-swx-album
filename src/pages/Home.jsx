import { Button } from '@/components/ui'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Home</h1>
      <Button type="link" to="/album">Album</Button>
      <Button type="link" to="/get-card">Get Card</Button>
    </div>
  )
}

export default Home