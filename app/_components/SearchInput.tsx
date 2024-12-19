'use client';

import {Search} from 'lucide-react';
import {useRouter} from 'next/navigation';
import qs from 'query-string';
import {useDebounce} from 'usehooks-ts';
import {ChangeEvent, useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';

function SearchInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: '/',
        query: {
          search: debouncedValue,
        },
      },
      {skipNull: true, skipEmptyString: true}
    );
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        className="w-full max-w-[500px] pl-9"
        placeholder="Search Boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default SearchInput;
