import React from 'react';
import { motion } from 'framer-motion';
import AlbumCard from './AlbumCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

interface ImageGridProps {
  albums: any[];
  isLoading: boolean;
}

export default function ImageGrid({ albums, isLoading }: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="w-full aspect-[4/2] bg-gray-800 animate-pulse rounded-xl"></div>
    );
  }

  return (
    <motion.div
      className="overflow-hidden rounded-md flex flex-col md:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="md:w-1/2 flex-shrink-0" variants={itemVariants}>
        <AlbumCard album={albums[0]} isLarge={true} />
      </motion.div>
      <div className="md:w-1/2 grid grid-cols-2">
        {albums.slice(1, 5).map((album, index) => (
          <motion.div key={index} variants={itemVariants}>
            <AlbumCard album={album} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}