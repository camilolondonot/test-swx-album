import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, AlbumPage, GetCardPage } from '@/pages'
import MainLayout from '@/components/Layout/MainLayout'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/get-card" element={<GetCardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter