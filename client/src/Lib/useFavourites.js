import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'qs_favourites_v1'

const toId = (movieOrId) => {
  if (movieOrId === undefined || movieOrId === null) return ''
  if (typeof movieOrId === 'string' || typeof movieOrId === 'number') return String(movieOrId)
  return String(movieOrId._id ?? movieOrId.id ?? '')
}

export default function useFavourites () {
  const [favourites, setFavourites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
      // notify other listeners in the same window
      window.dispatchEvent(new CustomEvent('qs:favourites-changed'))
    } catch (e) {
      // ignore
    }
  }, [favourites])

  useEffect(() => {
    const arraysEqual = (a, b) => {
      if (a === b) return true
      if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
      return true
    }

    const handler = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const next = raw ? JSON.parse(raw) : []
        setFavourites(prev => (arraysEqual(prev, next) ? prev : next))
      } catch (e) {}
    }

    // listen to storage (other tabs) and custom event (same tab)
    window.addEventListener('storage', handler)
    window.addEventListener('qs:favourites-changed', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('qs:favourites-changed', handler)
    }
  }, [])

  const isFav = useCallback((movieOrId) => {
    const id = toId(movieOrId)
    return id ? favourites.includes(id) : false
  }, [favourites])

  const toggle = useCallback((movieOrId) => {
    const id = toId(movieOrId)
    if (!id) return
    setFavourites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }, [])

  return { favourites, setFavourites, isFav, toggle }
}
