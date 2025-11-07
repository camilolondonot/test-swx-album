const GetCardOption = () => {
  return (
    <div className="flex flex-col gap-4">
      <Button type="link" to="/get-card/people">Personajes</Button>
      <Button type="link" to="/get-card/films">Peliculas</Button>
      <Button type="link" to="/get-card/starships">Naves</Button>
    </div>
  )
}

export default GetCardOption