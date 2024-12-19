import Image from 'next/image';
import React from 'react';

const EmptyFavorites = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src={'/empty-fav.svg'}
        width={500}
        height={500}
        alt={'empty'}
      />
      <h2 className="text-2xl font-semibold mt-6">No Favorites Found</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try Favoriting boards
      </p>
    </div>
  );
};

export default EmptyFavorites;
