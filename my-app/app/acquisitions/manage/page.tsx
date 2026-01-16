'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageAcquisitionsPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/acquisitions');
    }, [router]);

    return null;
}
