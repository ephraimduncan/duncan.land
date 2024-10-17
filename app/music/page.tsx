'use client';

import React, { useState } from 'react'
import { useLastFmData } from '@/lib/hooks/use-music-data'
import { MotionDiv } from "@/components/motion"
import Link from 'next/link'
import { motion } from 'framer-motion';
const MotionLink = motion(Link);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const albumHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
}

const ImageGrid: React.FC<{ albums: any[] }> = ({ albums }) => {
  return (
    <div className="overflow-hidden rounded-md flex flex-col md:flex-row">
      <div className="md:w-1/2 flex-shrink-0">
        <AlbumCard album={albums[0]} isLarge={true} />
      </div>
      <div className="md:w-1/2 grid grid-cols-2">
        {albums.slice(1, 5).map((album, index) => (
          <AlbumCard key={index} album={album} />
        ))}
      </div>
    </div>
  );
};

const AlbumCard: React.FC<{ album: any; isLarge?: boolean }> = ({ album, isLarge = false }) => {
  if (!album) return null;

  return (
    <Link 
      href={album.url} 
      className="relative overflow-hidden block h-full"
    >
      <MotionDiv 
        className="w-full h-full"
        variants={imageHoverVariants}
        initial="rest"
        whileHover="hover"
      >
        <img 
          src={album.image.find(img => img.size === 'extralarge')?.['#text'] || `/placeholder.svg?height=${isLarge ? 600 : 300}&width=${isLarge ? 600 : 300}`} 
          alt={`${album.name} by ${album.artist.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      </MotionDiv>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-sm font-semibold truncate">{album.name}</h3>
        <p className="text-xs truncate">{album.artist.name}</p>
        <p className="text-xs">{album.playcount} plays</p>
      </div>
    </Link>
  );
};

const CustomSelect: React.FC<{
  value: string,
  onChange: (value: string) => void,
  options: { value: string, label: string }[]
}> = ({ value, onChange, options }) => {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function MusicPage() {
  const [period, setPeriod] = useState<'7day' | '1month' | '3month' | '6month' | '12month' | 'overall'>('1month')
  const { data, loading, error } = useLastFmData(period)

  if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>

  return (
    <MotionDiv initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto px-4">
      <MotionDiv variants={childVariants} className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Top Albums</h1>
        <CustomSelect
          value={period}
          onChange={(value) => setPeriod(value as any)}
          options={[
            { value: '7day', label: 'Last 7 days' },
            { value: '1month', label: 'Last 30 days' },
            { value: '3month', label: 'Last 3 months' },
            { value: '6month', label: 'Last 6 months' },
            { value: '12month', label: 'Last year' },
            { value: 'overall', label: 'All time' },
          ]}
        />
      </MotionDiv>

      <MotionDiv variants={childVariants} className="mb-10">
        {loading ? (
          <div className="w-full aspect-[3/2] bg-gray-800 animate-pulse rounded-xl"></div>
        ) : (
          <ImageGrid albums={data?.topAlbums || []} />
        )}
      </MotionDiv>

      <MotionDiv variants={childVariants}>
        <h2 className="text-2xl font-bold mb-4">Recent Tracks</h2>
        <ul className="space-y-4">
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <li key={index} className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                <div className="w-16 h-16 bg-gray-800 animate-pulse rounded"></div>
                <div className="flex-grow">
                  <div className="h-6 w-3/4 bg-gray-800 animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-800 animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-800 animate-pulse"></div>
              </li>
            ))
          ) : (
            data?.recentTracks.map((track, index) => (
              <li key={index} className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                <Link href={track.url} className="relative w-16 h-16 overflow-hidden rounded">
                  <MotionDiv
                    variants={albumHoverVariants}
                    initial="rest"
                    whileHover="hover"
                  >
                    <img 
                      src={track.image.find(img => img.size === 'medium')?.['#text'] || '/placeholder.svg?height=64&width=64'} 
                      alt={`${track.name} by ${track.artist['#text']}`}
                      className="w-full h-full object-cover"
                    />
                  </MotionDiv>
                </Link>
                <div className="flex-grow">
                  <Link href={track.url} className="hover:underline">
                    <h3 className="text-lg font-semibold">{track.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-400">{track.artist['#text']}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {track['@attr']?.nowplaying ? 'Scrobbling now' : getRelativeTime(track.date?.['#text'] || '')}
                </div>
              </li>
            ))
          )}
        </ul>
      </MotionDiv>
    </MotionDiv>
  )
}