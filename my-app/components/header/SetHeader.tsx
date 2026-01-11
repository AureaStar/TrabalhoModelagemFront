'use client';

import { useHeader } from './HeaderContext';
import { useEffect } from 'react';

interface SetHeaderProps {
  content: string;
}

export default function SetHeader({ content }: SetHeaderProps) {
  const { setHeaderContent } = useHeader();

  useEffect(() => {
    setHeaderContent(content);
  }, [setHeaderContent, content]);

  return null;
}