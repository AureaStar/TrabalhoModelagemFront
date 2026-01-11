'use client';

import { useHeader } from './HeaderContext';

export default function HeaderContent() {
  const { headerContent } = useHeader();
  return <>
            <header className="p-6 pl-44 bg-background-white border-b border-gray-200">
                <h1 className="text-xl font-semibold text-black">{headerContent}</h1>
            </header>
        </>;
}