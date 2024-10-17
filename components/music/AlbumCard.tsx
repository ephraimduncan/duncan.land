import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

interface ImageObject {
  size: string;
  '#text': string;
}

interface Artist {
  name: string;
}

interface Album {
  url: string;
  image: ImageObject[];
  name: string;
  artist: Artist;
  playcount: number;
}

interface AlbumCardProps {
  album: Album;
  isLarge?: boolean;
}

export default function AlbumCard({ album, isLarge = false }: AlbumCardProps) {
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
          src={album.image.find((img: ImageObject) => img.size === 'extralarge')?.['#text'] || `/placeholder.svg?height=${isLarge ? 600 : 300}&width=${isLarge ? 600 : 300}`} 
          alt={`${album.name} by ${album.artist.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      </MotionDiv>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white pointer-events-none">
        <h3 className="text-sm font-semibold truncate">{album.name}</h3>
        <p className="text-xs truncate">{album.artist.name}</p>
        <p className="text-xs">{album.playcount} plays</p>
      </div>
    </Link>
  );
}