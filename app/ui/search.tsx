//  Это клиентский компонент, что означает, что вы можете использовать прослушиватели событий и перехватчики.
'use client';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();   //доступ програмно
  const pathname = usePathname();
  const { replace } = useRouter();

  // function handleSearch(term: string) {
    const handleSearch = useDebouncedCallback((term) => {

      console.log(`Searching... ${term}`);

      const params = new URLSearchParams(searchParams); //экземпляр веб-API, использует новую searchParams переменную
        params.set('page', '1');
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      //URL-адрес обновляется без перезагрузки страницы благодаря клиентской навигации Next.js
      replace(`${pathname}?${params.toString()}`); // обновляет URL-адрес данными поиска пользователя.  Tекущий путь,  "/dashboard/invoices".

    }, 300);

    return (
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    );
  }
// }
