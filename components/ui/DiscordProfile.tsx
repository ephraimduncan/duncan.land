'use client'

import { useDiscordStatus } from '@/lib/hooks/use-discord-status'
import { useState, useEffect } from 'react'

export default function DiscordProfile() {
  const { avatar, discordStatus, customStatus } = useDiscordStatus()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (discordStatus) {
      setIsLoaded(true)
    }
  }, [discordStatus])

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const statusColor = getStatusColor(discordStatus?.discord_status)

  const renderAvatar = () => (
    <div className="relative">
      {isLoaded && avatar ? (
        <img
          src={avatar}
          alt="Discord avatar"
          className="w-16 h-16 rounded-md object-cover"
        />
      ) : (
        <img
          src="/static/avatar.gif"
          alt="Trixzy's Discord Avatar"
          className="w-16 h-16 rounded-md object-cover"
        />
      )}
      <div className={`absolute bottom-0 right-0 w-4 h-4 ${statusColor} rounded-full border-2 border-white dark:border-gray-800 ${discordStatus?.discord_status === 'offline' ? '' : 'animate-pulse'}`} />
    </div>
  )

  const renderStatus = () => {
    if (!isLoaded) return <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
    
    if (customStatus?.state) {
      return (
        <div className="flex items-center space-x-1">
          {customStatus.emoji && (
            <img
              src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png`}
              alt={customStatus.emoji.name}
              className="w-4 h-4"
            />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">{customStatus.state}</span>
        </div>
      )
    }
    
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
        {discordStatus?.discord_status || 'Offline'}
      </p>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {renderAvatar()}
      <div>
        <h1 className="text-2xl font-semibold">Hi I'm Zac</h1>
        {renderStatus()}
      </div>
    </div>
  )
}