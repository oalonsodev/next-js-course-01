'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Importa el ícono desde heroicons
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Hook para manejar parámetros de búsqueda, navegación y ruta actual
import { useDebouncedCallback } from 'use-debounce'; // Hook para manejar la función de debounce

// Componente de búsqueda reutilizable
export default function Search({ placeholder }: { placeholder: string }) {
  
  const searchParams = useSearchParams(); // Obtiene los parámetros de búsqueda de la URL
  const pathname = usePathname(); // Obtiene la ruta actual
  const { replace } = useRouter(); // Hook para reemplazar la URL actual

  // Handler para la función de búsqueda
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching...${term}`);
    
    const params = new URLSearchParams(searchParams); // qué hace URLSearchParams: no es un hook, es una API nativa de JS que permite manejar query strings
    
    params.set('page', '1'); // Resetea la página a 1 en cada búsqueda
    // Aquí vinculamos el término de búsqueda con el parámetro 'query' en la URL
    if (term) {
      params.set('query', term); // Si hay un término de búsqueda, lo agrega o actualiza en los parámetros
    } else {
      params.delete('query'); // Si el término está vacío, elimina el parámetro de búsqueda
    }
    replace(`${pathname}?${params.toString()}`) // Reemplaza la URL actual con la nueva URL que incluye los parámetros de búsqueda actualizados
  }, 300)

  return (
    <div className="relative flex flex-1 flex-shrink-0"> {/* Contenedor relativo para el ícono */}
      <label htmlFor="search" className="sr-only"> {/* Etiqueta disponible para lectores de pantalla */}
        Search
      </label>
      {/* Input de búsqueda con padding a la izquierda para el ícono */}
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => { {/* Llama a handleSearch al cambiar el valor del input */}
          handleSearch(e.target.value)}
        }
        defaultValue= {searchParams.get('query')?.toString()} // Establece el valor por defecto del input basado en el parámetro de búsqueda 'query'. Así, si se comparte la URL, el input mostrará el término de búsqueda correcto.
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
