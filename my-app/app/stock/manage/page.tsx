'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageStockPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/stock');
    }, [router]);

    return null;
}
