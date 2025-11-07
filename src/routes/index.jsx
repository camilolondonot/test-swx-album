import { BrowserRouter, Routes, Route } from 'react-router'
import { HomePage, AlbumPage, GetCardPage } from '@/pages'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/album" element={<AlbumPage />} />
        <Route path="/get-card" element={<GetCardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter