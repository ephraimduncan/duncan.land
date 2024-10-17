import { useState, useEffect } from 'react'

type Period = '7day' | '1month' | '3month' | '6month' | '12month' | 'overall'

interface Album {
  name: string
  artist: {
    name: string
    url: string // Add URL for the artist
  }
  playcount: string
  image: { '#text': string, size: string }[] // Add size for clarity
  url: string // Add URL for the album
}

interface Track {
  name: string
  artist: {
    '#text': string
    mbid: string
  }
  album: {
    '#text': string
  }
  image: { '#text': string, size: string }[]
  url: string // Add URL for the track
  date?: {
    '#text': string
    uts: string
  }
}

interface LastFmData {
  topAlbums: Album[]
  recentTracks: Track[]
}

export function useLastFmData(period: Period) {
  const [data, setData] = useState<LastFmData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/lastfm?period=${period}`)
            if (!response.ok) {
                throw new Error('Network response was not ok :(')
            }
            const data = await response.json()
            setData(data)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'))
        } finally {
            setLoading(false)
        }
    }

    fetchData()
  }, [period])

  return { data, loading, error }
}
