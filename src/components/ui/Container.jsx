const Container = ({ children }) => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      {children}
    </div>
  )
}

export default Container