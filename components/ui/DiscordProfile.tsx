'use client'

import { useDiscordStatus } from '@/lib/hooks/use-discord-status'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
        <div className="relative w-16 h-16">
            {isLoaded && avatar ? (
                <Image
                    src={avatar}
                    alt="Discord avatar"
                    layout="fill"
                    className="rounded-md object-cover"
                    onError={(e) => { e.currentTarget.src = '/static/avatar.png'; }}
                />
            ) : (
                <Image
                    src="/static/avatar.png"
                    alt="Fallback avatar"
                    layout="fill"
                    className="rounded-md object-cover"
                />
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center">
                {discordStatus?.discord_status !== 'offline' && (
                    <span className={`absolute inline-flex w-3 h-3 rounded-full ${statusColor} opacity-75 animate-ping`} style={{ animationDuration: '2s' }} />
                )}
                <span className={`relative inline-flex rounded-full ${statusColor} w-3 h-3`} />
            </div>
        </div>
    )

    const renderEmoji = (emoji: { name: string; id: string; animated: boolean }) => {
        const extension = emoji.animated ? 'gif' : 'png'
        return (
            <Image
                src={`https://cdn.discordapp.com/emojis/${emoji.id}.${extension}`}
                alt={emoji.name}
                width={16}
                height={16}
                className="w-4 h-4 mr-1"
            />
        )
    }

    const renderStatus = () => {
        if (!isLoaded) {
            return (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading...</span>
                </div>
            )
        }

        return (
            <AnimatePresence mode="wait">
                {customStatus?.state ? (
                    <motion.div
                        key="customStatus"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-1"
                    >
                        {customStatus.emoji && renderEmoji(customStatus.emoji)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">{customStatus.state}</span>
                    </motion.div>
                ) : (
                    <motion.p
                        key="discordStatus"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-gray-600 dark:text-gray-400 capitalize"
                    >
                        {discordStatus?.discord_status || 'Offline'}
                    </motion.p>
                )}
            </AnimatePresence>
        )
    }

    return (
        <div className="flex items-center space-x-5">
            {renderAvatar()}
            <div>
                <h1 className="text-2xl font-semibold">Hi I'm Zac</h1>
                {renderStatus()}
            </div>
        </div>
    )
}