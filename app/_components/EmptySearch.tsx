import Image from 'next/image';
import React from 'react';

const EmptySearch = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src={'/empty-search.svg'}
        width={500}
        height={500}
        alt="empty search"
      />
      <h2 className="text-2xl font-semibold mt-6">No Results found</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try searching something else
      </p>
    </div>
  );
};

export default EmptySearch;
