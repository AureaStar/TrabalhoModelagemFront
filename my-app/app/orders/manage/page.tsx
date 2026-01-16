'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageOrdersPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/orders');
    }, [router]);

    return null;
}
