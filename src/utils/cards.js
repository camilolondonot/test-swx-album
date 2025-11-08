/**
 * Utilidades para trabajar con las cartas del álbum.
 */

const extractIdFromUrl = (url) => {
  if (typeof url !== 'string') return null
  const segments = url.split('/').filter(Boolean)
  const lastSegment = segments.pop()
  const parsed = Number(lastSegment)
  return Number.isNaN(parsed) ? null : parsed
}

export const getResourceId = (type, data) => {
  if (!data) return null
  if (data?.url) {
    return extractIdFromUrl(data.url)
  }
  if (data?.id != null) {
    return Number(data.id)
  }
  return null
}

export const getResourceUniqueKey = (type, data) => {
  if (!data) return `${type}-unknown`
  if (data?.url) return data.url
  const id = getResourceId(type, data)
  if (id != null) return `${type}-${id}`
  if (data?.name) return `${type}-${data.name}`
  if (data?.title) return `${type}-${data.title}`
  return `${type}-${JSON.stringify(data)}`
}

export const isSpecialCard = (type, resourceId) => {
  if (!resourceId) return false
  if (type === 'film') {
    return resourceId >= 1 && resourceId <= 6
  }
  if (type === 'people') {
    return resourceId >= 1 && resourceId <= 20
  }
  if (type === 'starship') {
    return resourceId >= 1 && resourceId <= 10
  }
  return false
}

export const getAlbumSectionMeta = (type) => {
  switch (type) {
    case 'film':
      return { title: 'Películas', total: 6 }
    case 'people':
      return { title: 'Personajes', total: 82 }
    case 'starship':
      return { title: 'Naves', total: 36 }
    default:
      return { title: 'Otros', total: 0 }
  }
}
